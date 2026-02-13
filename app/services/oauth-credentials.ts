import { app } from "electron";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import type { OAuthCredentials } from "@mariozechner/pi-ai";

/**
 * OAuth Credentials Storage Service
 * 
 * Manages persistent storage of OAuth credentials for various providers.
 * Credentials are stored in auth.json in the user data directory.
 */

interface AuthStorage {
  "openai-codex"?: {
    type: "oauth";
  } & OAuthCredentials;
  [provider: string]: any;
}

const getAuthFilePath = (): string => {
  const userDataPath = app.getPath("userData");
  return join(userDataPath, "auth.json");
};

/**
 * Load OAuth credentials from storage
 */
export const loadOAuthCredentials = (
  provider: "openai-codex"
): OAuthCredentials | null => {
  try {
    const authPath = getAuthFilePath();
    if (!existsSync(authPath)) {
      return null;
    }

    const authData: AuthStorage = JSON.parse(readFileSync(authPath, "utf-8"));
    const providerData = authData[provider];

    if (!providerData || providerData.type !== "oauth") {
      return null;
    }

    // Return credentials without the 'type' field
    const { type, ...credentials } = providerData;
    return credentials as OAuthCredentials;
  } catch (error) {
    console.error(`Error loading OAuth credentials for ${provider}:`, error);
    return null;
  }
};

/**
 * Save OAuth credentials to storage
 */
export const saveOAuthCredentials = (
  provider: "openai-codex",
  credentials: OAuthCredentials
): void => {
  try {
    const authPath = getAuthFilePath();
    let authData: AuthStorage = {};

    // Load existing auth data if file exists
    if (existsSync(authPath)) {
      try {
        authData = JSON.parse(readFileSync(authPath, "utf-8"));
      } catch (error) {
        console.warn("Failed to parse existing auth.json, creating new file");
      }
    }

    // Update provider credentials
    authData[provider] = {
      type: "oauth",
      ...credentials,
    };

    // Save to file with pretty formatting
    writeFileSync(authPath, JSON.stringify(authData, null, 2), "utf-8");
    console.log(`OAuth credentials saved for ${provider}`);
  } catch (error) {
    console.error(`Error saving OAuth credentials for ${provider}:`, error);
    throw error;
  }
};

/**
 * Clear OAuth credentials for a provider
 */
export const clearOAuthCredentials = (provider: "openai-codex"): void => {
  try {
    const authPath = getAuthFilePath();
    if (!existsSync(authPath)) {
      return;
    }

    const authData: AuthStorage = JSON.parse(readFileSync(authPath, "utf-8"));
    delete authData[provider];

    writeFileSync(authPath, JSON.stringify(authData, null, 2), "utf-8");
    console.log(`OAuth credentials cleared for ${provider}`);
  } catch (error) {
    console.error(`Error clearing OAuth credentials for ${provider}:`, error);
    throw error;
  }
};

/**
 * Check if OAuth credentials exist for a provider
 */
export const hasOAuthCredentials = (provider: "openai-codex"): boolean => {
  const credentials = loadOAuthCredentials(provider);
  return credentials !== null;
};
