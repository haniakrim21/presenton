/**
 * OAuth Service using @mariozechner/pi-ai
 * 
 * This Node.js service runs in Docker and provides OAuth endpoints.
 * The pi-ai library has been patched to listen on 0.0.0.0 instead of 127.0.0.1
 * so it works correctly in Docker containers.
 */

import express from 'express';
import cors from 'cors';
import { loginOpenAICodex, refreshOAuthToken, getModels, complete, stream, getOAuthApiKey, Type } from '@mariozechner/pi-ai';
import fs from 'fs';
import path from 'path';

// OAuth API server (port 1456)
const app = express();
const PORT = process.env.OAUTH_SERVICE_PORT || 1456;
const USER_CONFIG_PATH = process.env.USER_CONFIG_PATH || '/app_data/userConfig.json';

app.use(cors());
app.use(express.json());

// Store active OAuth flow state
let activeOAuthFlow = null;

console.log('Using userConfig at:', USER_CONFIG_PATH);

/**
 * Load credentials from userConfig.json
 */
async function loadCredentials() {
  try {
    if (fs.existsSync(USER_CONFIG_PATH)) {
      const data = fs.readFileSync(USER_CONFIG_PATH, 'utf8');
      const config = JSON.parse(data);
      
      // Extract ChatGPT OAuth credentials from userConfig
      if (config.CHATGPT_ACCESS_TOKEN && config.CHATGPT_REFRESH_TOKEN) {
        return {
          access_token: config.CHATGPT_ACCESS_TOKEN,
          refresh_token: config.CHATGPT_REFRESH_TOKEN,
          expires_at: config.CHATGPT_TOKEN_EXPIRES_AT,
          accountId: config.CHATGPT_ACCOUNT_ID || ''
        };
      }
    }
  } catch (error) {
    console.error('Error loading credentials from userConfig:', error);
  }
  return null;
}

/**
 * Normalize credentials from pi-ai format to our expected format
 * pi-ai returns: { access, refresh, expires, accountId }
 * We need: { access_token, refresh_token, expires_at, accountId }
 */
function normalizeCredentials(piaiCredentials) {
  return {
    access_token: piaiCredentials.access,
    refresh_token: piaiCredentials.refresh,
    expires_at: piaiCredentials.expires,
    accountId: piaiCredentials.accountId || ''
  };
}

/**
 * Save credentials to userConfig.json (single source of truth)
 */
async function saveCredentials(credentials) {
  try {
    const dir = path.dirname(USER_CONFIG_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Normalize credentials
    const normalized = normalizeCredentials(credentials);
    
    // Load existing config or create new
    let config = {};
    if (fs.existsSync(USER_CONFIG_PATH)) {
      config = JSON.parse(fs.readFileSync(USER_CONFIG_PATH, 'utf8'));
    }
    
    // Update ChatGPT OAuth fields - ONLY if they have actual values
    // This prevents accidentally clearing tokens when partial credentials are passed
    if (normalized.access_token !== undefined && normalized.access_token !== null && normalized.access_token !== '') {
      config.CHATGPT_ACCESS_TOKEN = normalized.access_token;
    }
    if (normalized.refresh_token !== undefined && normalized.refresh_token !== null && normalized.refresh_token !== '') {
      config.CHATGPT_REFRESH_TOKEN = normalized.refresh_token;
    }
    if (normalized.expires_at !== undefined && normalized.expires_at !== null) {
      config.CHATGPT_TOKEN_EXPIRES_AT = normalized.expires_at;
    }
    if (normalized.accountId !== undefined && normalized.accountId !== null && normalized.accountId !== '') {
      config.CHATGPT_ACCOUNT_ID = normalized.accountId;
    }
    // Only set LLM if we actually have valid tokens
    if (normalized.access_token && normalized.refresh_token) {
      config.LLM = 'openai-chatgpt'; // Set the LLM provider
    }
    
    // Save back to userConfig
    fs.writeFileSync(USER_CONFIG_PATH, JSON.stringify(config, null, 2));
    console.log('✅ Credentials saved to userConfig successfully');
    console.log('📝 Saved credentials:', {
      hasAccessToken: !!config.CHATGPT_ACCESS_TOKEN,
      hasRefreshToken: !!config.CHATGPT_REFRESH_TOKEN,
      accountId: config.CHATGPT_ACCOUNT_ID,
      expiresAt: config.CHATGPT_TOKEN_EXPIRES_AT,
      accessTokenPreview: config.CHATGPT_ACCESS_TOKEN ? `${config.CHATGPT_ACCESS_TOKEN.substring(0, 20)}...` : 'none'
    });
    return normalized;
  } catch (error) {
    console.error('❌ Error saving credentials to userConfig:', error);
    throw error;
  }
}

/**
 * POST /oauth/start
 * Start the OAuth flow using pi-ai
 * Returns the authorization URL
 * 
 * pi-ai will automatically start its callback server on port 1455 (listening on 0.0.0.0)
 */
app.post('/oauth/start', async (req, res) => {
  try {
    console.log('🚀 Starting OAuth flow...');
    
    // Start OAuth flow - pi-ai will handle the callback server automatically
    const oauthPromise = loginOpenAICodex({
      onAuth: (info) => {
        console.log('📝 OAuth URL generated:', info.url);
        // Store the URL so we can return it to the frontend
        if (activeOAuthFlow) {
          activeOAuthFlow.authUrl = info.url;
          activeOAuthFlow.urlReady.resolve();
        }
      },
      onPrompt: async (prompt) => {
        // This should not be called in normal flow, but handle it just in case
        console.log('⚠️ Unexpected prompt:', prompt.message);
        return '';
      },
      onProgress: (message) => {
        console.log('📊 OAuth progress:', message);
      },
    });

    // Create a promise that resolves when we have the auth URL
    const urlPromise = new Promise((resolve, reject) => {
      activeOAuthFlow = {
        promise: oauthPromise,
        authUrl: null,
        urlReady: { resolve, reject }
      };
      
      // Timeout after 10 seconds if URL not generated
      setTimeout(() => {
        if (!activeOAuthFlow.authUrl) {
          reject(new Error('Timeout waiting for OAuth URL'));
        }
      }, 10000);
    });

    // Wait for the URL to be ready
    await urlPromise;
    
    const authUrl = activeOAuthFlow.authUrl;
    
    // Continue OAuth flow in background
    oauthPromise.then(async (credentials) => {
      console.log('✅ OAuth flow completed successfully');
      console.log('   Access token:', credentials.access ? '***' + credentials.access.slice(-10) : 'missing');
      console.log('   Refresh token:', credentials.refresh ? '***' + credentials.refresh.slice(-10) : 'missing');
      console.log('   Expires at:', credentials.expires ? new Date(credentials.expires).toISOString() : 'missing');
      
      // Save credentials to userConfig (single source of truth)
      const normalized = await saveCredentials(credentials);
      
      activeOAuthFlow = null;
    }).catch((error) => {
      console.error('❌ OAuth flow failed:', error);
      activeOAuthFlow = null;
    });

    res.json({
      success: true,
      authorization_url: authUrl,
      message: 'OAuth flow started. Open the URL in your browser and authorize the application.'
    });

  } catch (error) {
    console.error('❌ Error starting OAuth flow:', error);
    activeOAuthFlow = null;
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to start OAuth flow'
    });
  }
});

/**
 * GET /oauth/status
 * Check if OAuth flow is complete and get credentials
 */
app.get('/oauth/status', async (req, res) => {
  try {
    const credentials = await loadCredentials();
    
    if (credentials) {
      res.json({
        success: true,
        authenticated: true,
        credentials: credentials  // Already in normalized format (access_token, refresh_token, expires_at)
      });
    } else {
      // Check if there's an active flow
      if (activeOAuthFlow && activeOAuthFlow.promise) {
        try {
          // Check if promise is resolved (with a short timeout)
          const result = await Promise.race([
            activeOAuthFlow.promise.then(creds => ({ type: 'success', creds })),
            new Promise(resolve => setTimeout(() => resolve({ type: 'pending' }), 100))
          ]);
          
          if (result.type === 'success') {
            const savedCreds = await loadCredentials();
            return res.json({
              success: true,
              authenticated: true,
              credentials: savedCreds
            });
          }
        } catch (error) {
          // Flow still in progress or failed
        }
      }
      
      res.json({
        success: true,
        authenticated: false,
        credentials: null
      });
    }
  } catch (error) {
    console.error('Error checking OAuth status:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to check OAuth status'
    });
  }
});

/**
 * POST /oauth/refresh
 * Refresh access token using refresh token
 */
app.post('/oauth/refresh', async (req, res) => {
  try {
    const { refresh_token } = req.body;
    
    if (!refresh_token) {
      return res.status(400).json({
        success: false,
        error: 'refresh_token is required'
      });
    }

    console.log('Refreshing access token...');
    const newCredentials = await refreshOAuthToken(refresh_token);
    
    // Normalize and save updated credentials to userConfig
    const normalized = await saveCredentials(newCredentials);
    
    console.log('✅ Token refreshed successfully');
    
    res.json({
      success: true,
      credentials: normalized  // Return normalized credentials
    });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to refresh token'
    });
  }
});

/**
 * GET /oauth/models
 * Get available Codex models
 */
app.get('/oauth/models', async (req, res) => {
  try {
    console.log('📋 Fetching Codex models...');
    
    const models = getModels('openai-codex');
    
    const modelList = models.map(m => ({
      id: m.id,
      name: m.name,
      reasoning: m.reasoning || false,
      description: m.name
    }));
    
    res.json({
      success: true,
      models: modelList
    });
  } catch (error) {
    console.error('Error fetching models:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch models'
    });
  }
});

/**
 * DELETE /oauth/logout
 * Clear stored credentials
 */
app.delete('/oauth/logout', async (req, res) => {
  try {
    // Clear from userConfig
    if (fs.existsSync(USER_CONFIG_PATH)) {
      const config = JSON.parse(fs.readFileSync(USER_CONFIG_PATH, 'utf8'));
      delete config.CHATGPT_ACCESS_TOKEN;
      delete config.CHATGPT_REFRESH_TOKEN;
      delete config.CHATGPT_TOKEN_EXPIRES_AT;
      delete config.CHATGPT_ACCOUNT_ID;
      fs.writeFileSync(USER_CONFIG_PATH, JSON.stringify(config, null, 2));
      console.log('✅ Credentials cleared from userConfig');
    }
    
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to logout'
    });
  }
});

/**
 * POST /oauth/test
 * Test the Codex API by listing available models and making a simple chat request
 */
app.post('/oauth/test', async (req, res) => {
  try {
    console.log('🧪 Testing Codex API access...');
    
    // Load credentials
    const credentials = await loadCredentials();
    if (!credentials || !credentials.access_token) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated. Please login first.'
      });
    }
    
    // Test 1: Get available models
    console.log('  📋 Fetching available Codex models...');
    const models = getModels('openai-codex');
    console.log(`  ✅ Found ${models.length} Codex models`);
    
    // Test 2: Make a simple chat request
    console.log('  💬 Testing chat API...');
    const testModel = models.find(m => m.id.includes('gpt-5.1-codex') || m.id.includes('codex')) || models[0];
    
    if (!testModel) {
      throw new Error('No Codex models available');
    }
    
    console.log(`  🤖 Using model: ${testModel.id}`);
    
    // Simple test message
    const testResponse = await complete(
      testModel,
      [{ role: 'user', text: 'Say "Hello from Codex!" in exactly those words.' }],
      {
        credentials: {
          access: credentials.access_token,
          refresh: credentials.refresh_token,
          expires: credentials.expires_at,
          accountId: credentials.accountId
        }
      }
    );
    
    console.log('  ✅ Chat API test successful!');
    console.log(`  📝 Response: ${testResponse.text?.substring(0, 100)}...`);
    
    res.json({
      success: true,
      message: 'Codex API is working!',
      test_results: {
        models_count: models.length,
        available_models: models.slice(0, 10).map(m => ({
          id: m.id,
          name: m.name,
          reasoning: m.reasoning || false
        })),
        test_model: {
          id: testModel.id,
          name: testModel.name
        },
        chat_response: testResponse.text?.substring(0, 200),
        usage: testResponse.usage
      }
    });
  } catch (error) {
    console.error('❌ Codex API test failed:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Codex API test failed',
      details: error.stack
    });
  }
});

/**
 * POST /codex/stream
 * Stream a completion from Codex API
 * Body: { model, messages, response_format?, max_tokens? }
 */
app.post('/codex/stream', async (req, res) => {
  try {
    const { model: modelId, messages, response_format, max_tokens } = req.body;
    
    if (!modelId || !messages) {
      return res.status(400).json({
        success: false,
        error: 'model and messages are required'
      });
    }
    
    // Load credentials
    const credentials = await loadCredentials();
    if (!credentials || !credentials.access_token) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated. Please login first.'
      });
    }
    
    // Get the model
    const models = getModels('openai-codex');
    const model = models.find(m => m.id === modelId);
    
    if (!model) {
      return res.status(400).json({
        success: false,
        error: `Model ${modelId} not found`
      });
    }
    
    console.log(`📡 Streaming completion for model: ${model.id}`);
    
    // Convert messages format
    const context = messages.map(msg => ({
      role: msg.role,
      text: msg.content || msg.text
    }));
    
    // Set response headers for streaming
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    // Note: Don't set Transfer-Encoding explicitly - let Express handle it
    
    try {
      // Get API key from OAuth credentials (auto-refreshes if needed)
      const auth = {
        'openai-codex': {
          type: 'oauth',
          access: credentials.access_token,
          refresh: credentials.refresh_token,
          expires: credentials.expires_at,
          accountId: credentials.accountId
        }
      };
      
      const apiKeyResult = await getOAuthApiKey('openai-codex', auth);
      if (!apiKeyResult) {
        return res.status(401).json({
          success: false,
          error: 'Failed to get API key from OAuth credentials'
        });
      }
      
      // If credentials were refreshed, save them to userConfig
      if (apiKeyResult.newCredentials) {
        const refreshed = normalizeCredentials(apiKeyResult.newCredentials);
        await saveCredentials(refreshed);
      }
      
      // Create context in pi-ai format
      // pi-ai expects: { systemPrompt?: string, messages: [{role: 'user'|'assistant', content: string}] }
      // System messages go in systemPrompt, NOT in messages array
      
      let systemPrompt = undefined;
      const contextMessages = [];
      
      for (const msg of messages) {
        // Extract content from different formats
        let content = '';
        if (typeof msg.content === 'string') {
          content = msg.content;
        } else if (msg.text) {
          content = msg.text;
        } else if (msg.content && Array.isArray(msg.content)) {
          // If content is an array of blocks, extract text
          content = msg.content
            .filter(block => block.type === 'text' || block.text)
            .map(block => block.text || block.content || '')
            .join('\n');
        }
        
        // Separate system messages from user/assistant messages
        if (msg.role === 'system') {
          // pi-ai expects systemPrompt as a string, not in messages array
          systemPrompt = content;
        } else {
          contextMessages.push({
            role: msg.role,
            content: content
          });
        }
      }
      
      const context = {
        messages: contextMessages
      };
      
      // Add systemPrompt if present
      if (systemPrompt) {
        context.systemPrompt = systemPrompt;
      }
      
      // Add response_format if provided
      if (response_format) {
        context.responseFormat = response_format;
      }
      
      // Stream the response with the API key
      const messageStream = stream(model, context, { apiKey: apiKeyResult.apiKey });
      
      console.log('Starting to iterate stream events...');
      let chunkCount = 0;
      let totalChars = 0;
      
      // Iterate through the async stream of events
      for await (const event of messageStream) {
        // Log all event types to debug
        console.log(`Event type: ${event.type}`);
        
        // Only stream text_delta events (the actual text content)
        if (event.type === 'text_delta') {
          chunkCount++;
          totalChars += event.delta.length;
          res.write(event.delta);
        }
        // Optionally log errors
        else if (event.type === 'error') {
          console.error('Stream error:', event.error);
          if (!res.headersSent) {
            res.status(500).json({
              success: false,
              error: event.error.errorMessage || 'Stream error'
            });
            return;
          }
        }
        else if (event.type === 'done') {
          console.log(`✅ Stream complete. Chunks: ${chunkCount}, Total chars: ${totalChars}, Reason: ${event.reason}`);
        }
      }
      
      console.log(`Stream iteration finished. Total chunks sent: ${chunkCount}, Total chars: ${totalChars}`);
      
      // Close the response when done
      res.end();
      
    } catch (error) {
      console.error('Error creating stream:', error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          error: error.message || 'Failed to create stream'
        });
      } else {
        res.end();
      }
    }
    
  } catch (error) {
    console.error('Error in stream endpoint:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to stream completion'
      });
    }
  }
});

/**
 * POST /codex/complete
 * Get a complete (non-streaming) completion from Codex API with tool support
 * Body: { model, messages, tools?, max_tokens? }
 */
app.post('/codex/complete', async (req, res) => {
  try {
    const { model: modelId, messages, tools, max_tokens } = req.body;
    
    if (!modelId || !messages) {
      return res.status(400).json({
        success: false,
        error: 'model and messages are required'
      });
    }
    
    // Load credentials
    const credentials = await loadCredentials();
    if (!credentials || !credentials.access_token) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated. Please login first.'
      });
    }
    
    // Get the model
    const models = getModels('openai-codex');
    const model = models.find(m => m.id === modelId);
    
    if (!model) {
      return res.status(400).json({
        success: false,
        error: `Model ${modelId} not found`
      });
    }
    
    console.log(`📡 Getting complete response for model: ${model.id}`);
    
    try {
      // Get API key from OAuth credentials (auto-refreshes if needed)
      const auth = {
        'openai-codex': {
          type: 'oauth',
          access: credentials.access_token,
          refresh: credentials.refresh_token,
          expires: credentials.expires_at,
          accountId: credentials.accountId
        }
      };
      
      const apiKeyResult = await getOAuthApiKey('openai-codex', auth);
      if (!apiKeyResult) {
        return res.status(401).json({
          success: false,
          error: 'Failed to get API key from OAuth credentials'
        });
      }
      
      // If credentials were refreshed, save them to userConfig
      if (apiKeyResult.newCredentials) {
        const refreshed = normalizeCredentials(apiKeyResult.newCredentials);
        await saveCredentials(refreshed);
      }
      
      // Create context in pi-ai format
      let systemPrompt = undefined;
      const contextMessages = [];
      
      for (const msg of messages) {
        // Extract content from different formats
        let content = '';
        if (typeof msg.content === 'string') {
          content = msg.content;
        } else if (msg.text) {
          content = msg.text;
        } else if (msg.content && Array.isArray(msg.content)) {
          // If content is an array of blocks, extract text
          content = msg.content
            .filter(block => block.type === 'text' || block.text)
            .map(block => block.text || block.content || '')
            .join('\n');
        }
        
        // Separate system messages from user/assistant messages
        if (msg.role === 'system') {
          systemPrompt = content;
        } else {
          contextMessages.push({
            role: msg.role,
            content: content
          });
        }
      }
      
      const context = {
        messages: contextMessages
      };
      
      // Add systemPrompt if present
      if (systemPrompt) {
        context.systemPrompt = systemPrompt;
      }
      
      // Convert OpenAI tool format to pi-ai Tool format
      if (tools && Array.isArray(tools) && tools.length > 0) {
        const piTools = tools.map(tool => {
          // OpenAI format: { type: "function", function: { name, description, parameters } }
          // pi-ai format: { name, description, parameters } where parameters is a TypeBox schema
          const func = tool.function || tool;
          return {
            name: func.name,
            description: func.description || '',
            // pi-ai expects TypeBox schema, but we can pass JSON schema directly
            // pi-ai will handle the conversion
            parameters: func.parameters || {}
          };
        });
        context.tools = piTools;
        console.log(`🔧 Using ${piTools.length} tools`);
      }
      
      // Get complete response (non-streaming)
      const response = await complete(model, context, { apiKey: apiKeyResult.apiKey });
      
      // Extract text content and tool calls
      let textContent = '';
      const toolCalls = [];
      
      if (response && response.content) {
        for (const block of response.content) {
          if (block.type === 'text') {
            textContent += block.text || '';
          } else if (block.type === 'toolCall') {
            toolCalls.push({
              id: block.id || `tool_${Date.now()}_${Math.random()}`,
              type: 'function',
              function: {
                name: block.name,
                arguments: typeof block.arguments === 'string' 
                  ? block.arguments 
                  : JSON.stringify(block.arguments)
              }
            });
          }
        }
      }
      
      // Log response for debugging
      console.log(`✅ Complete response received. Text length: ${textContent.length}, Tool calls: ${toolCalls.length}`);
      
      // Ensure we always return valid data
      if (!textContent && toolCalls.length === 0) {
        console.warn('⚠️ Warning: Empty response from pi-ai complete');
        return res.status(500).json({
          success: false,
          error: 'Empty response from model'
        });
      }
      
      res.json({
        success: true,
        content: textContent,
        tool_calls: toolCalls.length > 0 ? toolCalls : undefined,
        usage: response?.usage
      });
      
    } catch (error) {
      console.error('Error getting complete response:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get complete response'
      });
    }
    
  } catch (error) {
    console.error('Error in complete endpoint:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get complete response'
    });
  }
});

// Start OAuth API server on port 1456
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 OAuth service listening on port ${PORT}`);
  console.log(`📡 pi-ai callback server will listen on port 1455 (0.0.0.0)`);
});
