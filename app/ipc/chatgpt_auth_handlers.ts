import { ipcMain, shell } from "electron";
import {
  loginOpenAICodex,
  getOAuthApiKey,
  type OAuthCredentials,
} from "@mariozechner/pi-ai";
import {
  loadOAuthCredentials,
  saveOAuthCredentials,
  clearOAuthCredentials,
} from "../services/oauth-credentials";

/**
 * ChatGPT OAuth IPC Handlers
 * 
 * Uses @mariozechner/pi-ai for OAuth authentication.
 * The library handles PKCE, token exchange, and refresh automatically.
 */

export function setupChatGPTAuthHandlers() {
  /**
   * Start the OAuth login flow using pi-ai
   * Returns the credentials which are automatically saved
   */
  ipcMain.handle("chatgpt-auth:login", async (_event) => {
    try {
      const credentials = await loginOpenAICodex({
        onAuth: (info: { url: string; instructions?: string }) => {
          // Open the URL in the user's default browser
          shell.openExternal(info.url);
          if (info.instructions) {
            console.log("OAuth Instructions:", info.instructions);
          }
        },
        onPrompt: async (prompt: { message: string; default?: string }) => {
          console.log("OAuth Prompt:", prompt.message);
          // For prompts in an Electron app, you could show a dialog
          // Return default or empty string
          return prompt.default || "";
        },
        onProgress: (message: string) => {
          console.log("OAuth Progress:", message);
        },
      });

      // Save credentials to storage
      saveOAuthCredentials("openai-codex", credentials);

      return {
        success: true,
        credentials,
      };
    } catch (error: any) {
      console.error("ChatGPT OAuth login failed:", error);
      return {
        success: false,
        error: error.message || "Login failed",
      };
    }
  });

  /**
   * Get current API key (handles token refresh automatically)
   */
  ipcMain.handle("chatgpt-auth:get-api-key", async (_event) => {
    try {
      const credentials = loadOAuthCredentials("openai-codex");
      if (!credentials) {
        return {
          success: false,
          error: "Not authenticated",
        };
      }

      // Build auth storage format expected by getOAuthApiKey
      const auth = {
        "openai-codex": {
          type: "oauth" as const,
          ...credentials,
        },
      };

      // Get API key (automatically refreshes if needed)
      const result = await getOAuthApiKey("openai-codex", auth);
      if (!result) {
        return {
          success: false,
          error: "Failed to get API key",
        };
      }

      // Save refreshed credentials if they changed
      if (result.newCredentials) {
        saveOAuthCredentials("openai-codex", result.newCredentials);
      }

      return {
        success: true,
        apiKey: result.apiKey,
        credentials: result.newCredentials || credentials,
      };
    } catch (error: any) {
      console.error("Failed to get ChatGPT API key:", error);
      return {
        success: false,
        error: error.message || "Failed to get API key",
      };
    }
  });

  /**
   * Get stored credentials
   */
  ipcMain.handle("chatgpt-auth:get-credentials", async (_event) => {
    try {
      const credentials = loadOAuthCredentials("openai-codex");
      return {
        success: true,
        credentials,
        isAuthenticated: credentials !== null,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  });

  /**
   * Logout (clear credentials)
   */
  ipcMain.handle("chatgpt-auth:logout", async (_event) => {
    try {
      clearOAuthCredentials("openai-codex");
      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Logout failed",
      };
    }
  });
}
