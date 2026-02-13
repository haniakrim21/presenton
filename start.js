/* This script starts the FastAPI and Next.js servers, setting up user configuration if necessary. It reads environment variables to configure API keys and other settings, ensuring that the user configuration file is created if it doesn't exist. The script also handles the starting of both servers and keeps the Node.js process alive until one of the servers exits. */

import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fastapiDir = join(__dirname, "servers/fastapi");
const nextjsDir = join(__dirname, "servers/nextjs");
const oauthServiceDir = join(__dirname, "servers/oauth-service");

const args = process.argv.slice(2);
const hasDevArg = args.includes("--dev") || args.includes("-d");
const isDev = hasDevArg;
const canChangeKeys = process.env.CAN_CHANGE_KEYS !== "false";

const fastapiPort = 8000;
const nextjsPort = 3000;
const appmcpPort = 8001;
const oauthServicePort = 1456; // OAuth API port (pi-ai uses 1455 for callbacks)

const userConfigPath = join(process.env.APP_DATA_DIRECTORY, "userConfig.json");
const userDataDir = dirname(userConfigPath);

// Create user_data directory if it doesn't exist
if (!existsSync(userDataDir)) {
  mkdirSync(userDataDir, { recursive: true });
}

// Setup node_modules for development
const setupNodeModules = async () => {
  // Install Next.js dependencies
  await new Promise((resolve, reject) => {
    console.log("Setting up node_modules for Next.js...");
    const npmProcess = spawn("npm", ["install"], {
      cwd: nextjsDir,
      stdio: "inherit",
      env: process.env,
    });

    npmProcess.on("error", (err) => {
      console.error("Next.js npm install failed:", err);
      reject(err);
    });

    npmProcess.on("exit", (code) => {
      if (code === 0) {
        console.log("Next.js npm install completed successfully");
        resolve();
      } else {
        console.error(`Next.js npm install failed with exit code: ${code}`);
        reject(new Error(`Next.js npm install failed with exit code: ${code}`));
      }
    });
  });

  // Install OAuth service dependencies
  await new Promise((resolve, reject) => {
    console.log("Setting up node_modules for OAuth service...");
    const npmProcess = spawn("npm", ["install"], {
      cwd: oauthServiceDir,
      stdio: "inherit",
      env: process.env,
    });

    npmProcess.on("error", (err) => {
      console.error("OAuth service npm install failed:", err);
      reject(err);
    });

    npmProcess.on("exit", (code) => {
      if (code === 0) {
        console.log("OAuth service npm install completed successfully");
        resolve();
      } else {
        console.error(`OAuth service npm install failed with exit code: ${code}`);
        reject(new Error(`OAuth service npm install failed with exit code: ${code}`));
      }
    });
  });
};

process.env.USER_CONFIG_PATH = userConfigPath;

//? UserConfig is only setup if API Keys can be changed
const setupUserConfigFromEnv = () => {
  let existingConfig = {};

  if (existsSync(userConfigPath)) {
    existingConfig = JSON.parse(readFileSync(userConfigPath, "utf8"));
  }

  // Validate LLM provider - include openai-chatgpt (Codex OAuth)
  if (!["ollama", "openai", "google", "anthropic", "custom", "openai-chatgpt"].includes(existingConfig.LLM)) {
    existingConfig.LLM = undefined;
  }

  // Only update values that are explicitly provided via env vars or don't exist yet
  // This ensures we don't overwrite values set by other services (like oauth-service)
  const updates = {
    LLM: process.env.LLM || existingConfig.LLM,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || existingConfig.OPENAI_API_KEY,
    OPENAI_MODEL: process.env.OPENAI_MODEL || existingConfig.OPENAI_MODEL,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || existingConfig.GOOGLE_API_KEY,
    GOOGLE_MODEL: process.env.GOOGLE_MODEL || existingConfig.GOOGLE_MODEL,
    OLLAMA_URL: process.env.OLLAMA_URL || existingConfig.OLLAMA_URL,
    OLLAMA_MODEL: process.env.OLLAMA_MODEL || existingConfig.OLLAMA_MODEL,
    ANTHROPIC_API_KEY:
      process.env.ANTHROPIC_API_KEY || existingConfig.ANTHROPIC_API_KEY,
    ANTHROPIC_MODEL:
      process.env.ANTHROPIC_MODEL || existingConfig.ANTHROPIC_MODEL,
    CUSTOM_LLM_URL: process.env.CUSTOM_LLM_URL || existingConfig.CUSTOM_LLM_URL,
    CUSTOM_LLM_API_KEY:
      process.env.CUSTOM_LLM_API_KEY || existingConfig.CUSTOM_LLM_API_KEY,
    CUSTOM_MODEL: process.env.CUSTOM_MODEL || existingConfig.CUSTOM_MODEL,
    PEXELS_API_KEY: process.env.PEXELS_API_KEY || existingConfig.PEXELS_API_KEY,
    PIXABAY_API_KEY:
      process.env.PIXABAY_API_KEY || existingConfig.PIXABAY_API_KEY,
    IMAGE_PROVIDER: process.env.IMAGE_PROVIDER || existingConfig.IMAGE_PROVIDER,
    TOOL_CALLS: process.env.TOOL_CALLS || existingConfig.TOOL_CALLS,
    DISABLE_THINKING:
      process.env.DISABLE_THINKING || existingConfig.DISABLE_THINKING,
    EXTENDED_REASONING:
      process.env.EXTENDED_REASONING || existingConfig.EXTENDED_REASONING,
    WEB_GROUNDING: process.env.WEB_GROUNDING || existingConfig.WEB_GROUNDING,
    USE_CUSTOM_URL: process.env.USE_CUSTOM_URL || existingConfig.USE_CUSTOM_URL,
    COMFYUI_URL: process.env.COMFYUI_URL || existingConfig.COMFYUI_URL,
    COMFYUI_WORKFLOW:
      process.env.COMFYUI_WORKFLOW || existingConfig.COMFYUI_WORKFLOW,
    DALL_E_3_QUALITY:
      process.env.DALL_E_3_QUALITY || existingConfig.DALL_E_3_QUALITY,
    GPT_IMAGE_1_5_QUALITY:
      process.env.GPT_IMAGE_1_5_QUALITY || existingConfig.GPT_IMAGE_1_5_QUALITY,
    CHATGPT_ACCESS_TOKEN: process.env.CHATGPT_ACCESS_TOKEN || existingConfig.CHATGPT_ACCESS_TOKEN,
    CHATGPT_REFRESH_TOKEN: process.env.CHATGPT_REFRESH_TOKEN || existingConfig.CHATGPT_REFRESH_TOKEN,
    CHATGPT_TOKEN_EXPIRES_AT: process.env.CHATGPT_TOKEN_EXPIRES_AT || existingConfig.CHATGPT_TOKEN_EXPIRES_AT,
    CHATGPT_ACCOUNT_ID: process.env.CHATGPT_ACCOUNT_ID || existingConfig.CHATGPT_ACCOUNT_ID,
    CHATGPT_MODEL: process.env.CHATGPT_MODEL || existingConfig.CHATGPT_MODEL,
  };
  
  // Merge updates with existing config, preserving all other fields
  const userConfig = {
    ...existingConfig,  // Keep all existing fields first
    ...updates          // Apply updates on top
  };

  writeFileSync(userConfigPath, JSON.stringify(userConfig, null, 2));
};

const startServers = async () => {
  const fastApiProcess = spawn(
    "python",
    [
      "server.py",
      "--port",
      fastapiPort.toString(),
      "--reload",
      isDev ? "true" : "false",
    ],
    {
      cwd: fastapiDir,
      stdio: "inherit",
      env: process.env,
    }
  );

  fastApiProcess.on("error", (err) => {
    console.error("FastAPI process failed to start:", err);
  });

  const appmcpProcess = spawn(
    "python",
    ["mcp_server.py", "--port", appmcpPort.toString()],
    {
      cwd: fastapiDir,
      stdio: "ignore",
      env: process.env,
    }
  );

  appmcpProcess.on("error", (err) => {
    console.error("App MCP process failed to start:", err);
  });

  // Start OAuth service using pi-ai (for Docker/web mode)
  const oauthServiceProcess = spawn(
    "node",
    ["server.js"],
    {
      cwd: oauthServiceDir,
      stdio: "inherit",
      env: {
        ...process.env,
        OAUTH_SERVICE_PORT: oauthServicePort.toString(),
        USER_CONFIG_PATH: userConfigPath,
      },
    }
  );

  oauthServiceProcess.on("error", (err) => {
    console.error("OAuth service failed to start:", err);
  });

  const nextjsProcess = spawn(
    "npm",
    [
      "run",
      isDev ? "dev" : "start",
      "--",
      "-H",
      "127.0.0.1",
      "-p",
      nextjsPort.toString(),
    ],
    {
      cwd: nextjsDir,
      stdio: "inherit",
      env: process.env,
    }
  );

  nextjsProcess.on("error", (err) => {
    console.error("Next.js process failed to start:", err);
  });

  const ollamaProcess = spawn("ollama", ["serve"], {
    cwd: "/",
    stdio: "inherit",
    env: process.env,
  });

  ollamaProcess.on("error", (err) => {
    console.error("Ollama process failed to start:", err);
  });

  // Keep the Node process alive until any server exits
  const exitCode = await Promise.race([
    new Promise((resolve) => fastApiProcess.on("exit", resolve)),
    new Promise((resolve) => nextjsProcess.on("exit", resolve)),
    new Promise((resolve) => oauthServiceProcess.on("exit", resolve)),
    new Promise((resolve) => ollamaProcess.on("exit", resolve)),
  ]);

  console.log(`One of the processes exited. Exit code: ${exitCode}`);
  process.exit(exitCode);
};

// Start nginx service
const startNginx = () => {
  const nginxProcess = spawn("service", ["nginx", "start"], {
    stdio: "inherit",
    env: process.env,
  });

  nginxProcess.on("error", (err) => {
    console.error("Nginx process failed to start:", err);
  });

  nginxProcess.on("exit", (code) => {
    if (code === 0) {
      console.log("Nginx started successfully");
    } else {
      console.error(`Nginx failed to start with exit code: ${code}`);
    }
  });
};

const main = async () => {
  if (isDev) {
    await setupNodeModules();
  }

  if (canChangeKeys) {
    setupUserConfigFromEnv();
  }

  startServers();
  startNginx();
};

main();
