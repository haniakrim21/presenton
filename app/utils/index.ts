import net from 'net'
import treeKill from 'tree-kill'
import fs from 'fs'
import { localhost, tempDir, userConfigPath } from './constants'

export function setUserConfig(userConfig: UserConfig) {
  let existingConfig: UserConfig = {}

  if (fs.existsSync(userConfigPath)) {
    const configData = fs.readFileSync(userConfigPath, 'utf-8')
    existingConfig = JSON.parse(configData)
  }
  
  // Only update fields that are explicitly provided (not undefined)
  // This ensures we don't overwrite values that weren't meant to be changed
  const mergedConfig: UserConfig = {
    ...existingConfig,  // Start with all existing fields
  }
  
  // Only update fields that are explicitly provided in userConfig
  if (userConfig.CAN_CHANGE_KEYS !== undefined) mergedConfig.CAN_CHANGE_KEYS = userConfig.CAN_CHANGE_KEYS;
  if (userConfig.LLM !== undefined) mergedConfig.LLM = userConfig.LLM;
  if (userConfig.OPENAI_API_KEY !== undefined) mergedConfig.OPENAI_API_KEY = userConfig.OPENAI_API_KEY;
  if (userConfig.OPENAI_MODEL !== undefined) mergedConfig.OPENAI_MODEL = userConfig.OPENAI_MODEL;
  if (userConfig.GOOGLE_API_KEY !== undefined) mergedConfig.GOOGLE_API_KEY = userConfig.GOOGLE_API_KEY;
  if (userConfig.GOOGLE_MODEL !== undefined) mergedConfig.GOOGLE_MODEL = userConfig.GOOGLE_MODEL;
  if (userConfig.ANTHROPIC_API_KEY !== undefined) mergedConfig.ANTHROPIC_API_KEY = userConfig.ANTHROPIC_API_KEY;
  if (userConfig.ANTHROPIC_MODEL !== undefined) mergedConfig.ANTHROPIC_MODEL = userConfig.ANTHROPIC_MODEL;
  if (userConfig.OLLAMA_URL !== undefined) mergedConfig.OLLAMA_URL = userConfig.OLLAMA_URL;
  if (userConfig.OLLAMA_MODEL !== undefined) mergedConfig.OLLAMA_MODEL = userConfig.OLLAMA_MODEL;
  if (userConfig.CUSTOM_LLM_URL !== undefined) mergedConfig.CUSTOM_LLM_URL = userConfig.CUSTOM_LLM_URL;
  if (userConfig.CUSTOM_LLM_API_KEY !== undefined) mergedConfig.CUSTOM_LLM_API_KEY = userConfig.CUSTOM_LLM_API_KEY;
  if (userConfig.CUSTOM_MODEL !== undefined) mergedConfig.CUSTOM_MODEL = userConfig.CUSTOM_MODEL;
  if (userConfig.PEXELS_API_KEY !== undefined) mergedConfig.PEXELS_API_KEY = userConfig.PEXELS_API_KEY;
  if (userConfig.PIXABAY_API_KEY !== undefined) mergedConfig.PIXABAY_API_KEY = userConfig.PIXABAY_API_KEY;
  if (userConfig.IMAGE_PROVIDER !== undefined) mergedConfig.IMAGE_PROVIDER = userConfig.IMAGE_PROVIDER;
  if (userConfig.DISABLE_IMAGE_GENERATION !== undefined) mergedConfig.DISABLE_IMAGE_GENERATION = userConfig.DISABLE_IMAGE_GENERATION;
  if (userConfig.EXTENDED_REASONING !== undefined) mergedConfig.EXTENDED_REASONING = userConfig.EXTENDED_REASONING;
  if (userConfig.TOOL_CALLS !== undefined) mergedConfig.TOOL_CALLS = userConfig.TOOL_CALLS;
  if (userConfig.DISABLE_THINKING !== undefined) mergedConfig.DISABLE_THINKING = userConfig.DISABLE_THINKING;
  if (userConfig.WEB_GROUNDING !== undefined) mergedConfig.WEB_GROUNDING = userConfig.WEB_GROUNDING;
  if (userConfig.DATABASE_URL !== undefined) mergedConfig.DATABASE_URL = userConfig.DATABASE_URL;
  if (userConfig.DISABLE_ANONYMOUS_TRACKING !== undefined) mergedConfig.DISABLE_ANONYMOUS_TRACKING = userConfig.DISABLE_ANONYMOUS_TRACKING;
  if (userConfig.COMFYUI_URL !== undefined) mergedConfig.COMFYUI_URL = userConfig.COMFYUI_URL;
  if (userConfig.COMFYUI_WORKFLOW !== undefined) mergedConfig.COMFYUI_WORKFLOW = userConfig.COMFYUI_WORKFLOW;
  if (userConfig.DALL_E_3_QUALITY !== undefined) mergedConfig.DALL_E_3_QUALITY = userConfig.DALL_E_3_QUALITY;
  if (userConfig.GPT_IMAGE_1_5_QUALITY !== undefined) mergedConfig.GPT_IMAGE_1_5_QUALITY = userConfig.GPT_IMAGE_1_5_QUALITY;
  if (userConfig.CHATGPT_ACCESS_TOKEN !== undefined) mergedConfig.CHATGPT_ACCESS_TOKEN = userConfig.CHATGPT_ACCESS_TOKEN;
  if (userConfig.CHATGPT_REFRESH_TOKEN !== undefined) mergedConfig.CHATGPT_REFRESH_TOKEN = userConfig.CHATGPT_REFRESH_TOKEN;
  if (userConfig.CHATGPT_TOKEN_EXPIRES_AT !== undefined) mergedConfig.CHATGPT_TOKEN_EXPIRES_AT = userConfig.CHATGPT_TOKEN_EXPIRES_AT;
  if (userConfig.CHATGPT_ACCOUNT_ID !== undefined) mergedConfig.CHATGPT_ACCOUNT_ID = userConfig.CHATGPT_ACCOUNT_ID;
  if (userConfig.CHATGPT_MODEL !== undefined) mergedConfig.CHATGPT_MODEL = userConfig.CHATGPT_MODEL;
  
  fs.writeFileSync(userConfigPath, JSON.stringify(mergedConfig, null, 2))
}

export function getUserConfig(): UserConfig {
  if (!fs.existsSync(userConfigPath)) {
    return {}
  }
  const configData = fs.readFileSync(userConfigPath, 'utf-8')
  return JSON.parse(configData)
}

export function setupEnv(fastApiPort: number, nextjsPort: number) {
  process.env.NEXT_PUBLIC_FAST_API = `${localhost}:${fastApiPort}`;
  process.env.TEMP_DIRECTORY = tempDir;
  process.env.NEXT_PUBLIC_USER_CONFIG_PATH = userConfigPath;
  process.env.NEXT_PUBLIC_URL = `${localhost}:${nextjsPort}`;
  
  // Set environment variables for NextJS API routes
  process.env.USER_CONFIG_PATH = userConfigPath;
  // Read CAN_CHANGE_KEYS from existing env or default to true
  if (process.env.CAN_CHANGE_KEYS === undefined) {
    process.env.CAN_CHANGE_KEYS = "true";
  }
}


export function killProcess(pid: number) {
  return new Promise((resolve, reject) => {
    treeKill(pid, "SIGTERM", (err: any) => {
      if (err) {
        console.error(`Error killing process ${pid}:`, err)
        reject(err)
      } else {
        console.log(`Process ${pid} killed`)
        resolve(true)
      }
    })
  })
}

export async function findUnusedPorts(startPort: number = 40000, count: number = 2): Promise<number[]> {
  const ports: number[] = [];
  console.log(`Finding ${count} unused ports starting from ${startPort}`);

  const isPortAvailable = (port: number): Promise<boolean> => {
    return new Promise((resolve) => {
      const server = net.createServer();
      server.once('error', () => {
        resolve(false);
      });
      server.once('listening', () => {
        server.close();
        resolve(true);
      });
      server.listen(port);
    });
  };

  let currentPort = startPort;
  while (ports.length < count) {
    if (await isPortAvailable(currentPort)) {
      ports.push(currentPort);
    }
    currentPort++;
  }

  return ports;
}


export function sanitizeFilename(filename: string): string {
  return filename.replace(/[\\/:*?"<>|]/g, '_');
}