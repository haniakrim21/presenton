import { loginOpenAICodex, refreshOAuthToken, type OAuthCredentials } from "@mariozechner/pi-ai";
import { shell } from "electron";
import { 
  saveOAuthCredentials, 
  loadOAuthCredentials,
  clearOAuthCredentials 
} from "./oauth-credentials";

/**
 * ChatGPT OAuth Service using @mariozechner/pi-ai
 * 
 * This service handles the OAuth PKCE flow for ChatGPT (OpenAI Codex) authentication.
 * The pi-ai library manages:
 * - PKCE challenge generation
 * - Local callback server (localhost:1455)
 * - Token exchange
 * - Credential storage
 */

const PROVIDER_ID = "openai-codex" as const;

export interface ChatGPTAuthResult {
  credentials: OAuthCredentials;
  accountId?: string;
}

/**
 * Start the ChatGPT OAuth login flow
 * 
 * This will:
 * 1. Start a local callback server
 * 2. Open the ChatGPT authorization URL in the user's browser
 * 3. Wait for the OAuth callback
 * 4. Exchange the code for tokens
 * 5. Save credentials to storage
 * 
 * @returns OAuth credentials including access_token, refresh_token, and expiry
 */
export const startChatGPTLogin = async (): Promise<ChatGPTAuthResult> => {
  try {
    // Start the OAuth flow using pi-ai
    // The library handles PKCE, callback server, and token exchange
    const credentials = await loginOpenAICodex({
      // Open authorization URL in user's default browser
      onAuth: (info: { url: string; instructions?: string }) => {
        console.log("Opening authorization URL in browser:", info.url);
        if (info.instructions) {
          console.log("Instructions:", info.instructions);
        }
        shell.openExternal(info.url);
      },
      // Handle prompts (not typically needed for OAuth flows with browser)
      onPrompt: async (prompt: { message: string; default?: string }) => {
        console.log("OAuth Prompt:", prompt.message);
        // In an Electron app, you could show a dialog here
        // For now, return empty string as prompts are rare in OAuth flows
        return prompt.default || "";
      },
      // Show progress messages
      onProgress: (message: string) => {
        console.log("OAuth Progress:", message);
      },
    });

    // Save credentials to persistent storage
    saveOAuthCredentials(PROVIDER_ID, credentials);

    console.log("ChatGPT OAuth login successful");
    
    return {
      credentials,
      // Extract account_id from token if available
      accountId: extractAccountId(credentials),
    };
  } catch (error: any) {
    console.error("ChatGPT OAuth login failed:", error);
    throw new Error(error.message || "OAuth login failed");
  }
};

/**
 * Refresh the ChatGPT access token using the refresh token
 * 
 * @param refreshToken The refresh token to use
 * @returns Updated OAuth credentials
 */
export const refreshChatGPTToken = async (
  refreshToken?: string
): Promise<ChatGPTAuthResult> => {
  try {
    // Load stored credentials if refresh token not provided
    let currentCredentials = loadOAuthCredentials(PROVIDER_ID);
    
    if (!refreshToken && !currentCredentials?.refresh_token) {
      throw new Error("No refresh token available. Please login again.");
    }

    const credentialsToRefresh = refreshToken 
      ? { ...currentCredentials, refresh_token: refreshToken } as OAuthCredentials
      : currentCredentials!;

    // Use pi-ai's refreshOAuthToken function
    const credentials = await refreshOAuthToken(PROVIDER_ID, credentialsToRefresh);

    // Save updated credentials
    saveOAuthCredentials(PROVIDER_ID, credentials);

    console.log("ChatGPT token refreshed successfully");

    return {
      credentials,
      accountId: extractAccountId(credentials),
    };
  } catch (error: any) {
    console.error("Token refresh failed:", error);
    throw new Error(error.message || "Token refresh failed");
  }
};

/**
 * Get stored ChatGPT OAuth credentials
 * 
 * @returns Stored credentials or null if not found
 */
export const getChatGPTCredentials = (): OAuthCredentials | null => {
  return loadOAuthCredentials(PROVIDER_ID);
};

/**
 * Logout from ChatGPT (clear stored credentials)
 */
export const logoutChatGPT = (): void => {
  clearOAuthCredentials(PROVIDER_ID);
  console.log("ChatGPT credentials cleared");
};

/**
 * Check if user is authenticated with ChatGPT
 * 
 * @returns true if valid credentials exist
 */
export const isChatGPTAuthenticated = (): boolean => {
  const credentials = getChatGPTCredentials();
  
  if (!credentials || !credentials.access_token) {
    return false;
  }

  // Check if token is expired
  if (credentials.expires_at) {
    const now = Math.floor(Date.now() / 1000);
    const expiresAt = typeof credentials.expires_at === 'number' ? credentials.expires_at : 0;
    if (now >= expiresAt) {
      return false;
    }
  }

  return true;
};

/**
 * Check if token is expired or expiring soon
 * 
 * @param bufferSeconds Seconds before expiry to consider as "expiring soon" (default: 300 = 5 minutes)
 * @returns true if token is expired or will expire within buffer period
 */
export const isTokenExpiring = (bufferSeconds: number = 300): boolean => {
  const credentials = getChatGPTCredentials();
  
  if (!credentials?.expires_at) {
    return false;
  }

  const now = Math.floor(Date.now() / 1000);
  const expiresAt = typeof credentials.expires_at === 'number' ? credentials.expires_at : 0;
  return now >= (expiresAt - bufferSeconds);
};

/**
 * Extract account ID from OAuth credentials (if available in token)
 * This is a placeholder - actual implementation depends on token structure
 */
const extractAccountId = (credentials: OAuthCredentials): string | undefined => {
  // ChatGPT tokens may contain account info in JWT payload
  // This would require decoding the access_token JWT
  // For now, return undefined - account_id can be fetched separately if needed
  return undefined;
};
