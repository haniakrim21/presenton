import { NextResponse } from "next/server";
import fs from "fs";
import { LLMConfig } from "@/types/llm_config";

const userConfigPath = process.env.USER_CONFIG_PATH!;
const canChangeKeys = process.env.CAN_CHANGE_KEYS !== "false";

export async function GET() {
  if (!canChangeKeys) {
    return NextResponse.json({
      error: "You are not allowed to access this resource",
      status: 403,
    });
  }
  if (!userConfigPath) {
    return NextResponse.json({
      error: "User config path not found",
      status: 500,
    });
  }

  if (!fs.existsSync(userConfigPath)) {
    return NextResponse.json({});
  }
  const configData = fs.readFileSync(userConfigPath, "utf-8");
  return NextResponse.json(JSON.parse(configData));
}

export async function POST(request: Request) {
  if (!canChangeKeys) {
    return NextResponse.json({
      error: "You are not allowed to access this resource",
    });
  }

  const userConfig = await request.json();

  let existingConfig: LLMConfig = {};
  if (fs.existsSync(userConfigPath)) {
    const configData = fs.readFileSync(userConfigPath, "utf-8");
    existingConfig = JSON.parse(configData);
  }
  
  // Create updates object with only the fields present in userConfig
  // This ensures we only update what the user explicitly wants to change
  const updates: Partial<LLMConfig> = {};
  
  // Only add fields to updates if they are present in userConfig
  if (userConfig.LLM !== undefined) updates.LLM = userConfig.LLM;
  if (userConfig.OPENAI_API_KEY !== undefined) updates.OPENAI_API_KEY = userConfig.OPENAI_API_KEY;
  if (userConfig.OPENAI_MODEL !== undefined) updates.OPENAI_MODEL = userConfig.OPENAI_MODEL;
  if (userConfig.GOOGLE_API_KEY !== undefined) updates.GOOGLE_API_KEY = userConfig.GOOGLE_API_KEY;
  if (userConfig.GOOGLE_MODEL !== undefined) updates.GOOGLE_MODEL = userConfig.GOOGLE_MODEL;
  if (userConfig.ANTHROPIC_API_KEY !== undefined) updates.ANTHROPIC_API_KEY = userConfig.ANTHROPIC_API_KEY;
  if (userConfig.ANTHROPIC_MODEL !== undefined) updates.ANTHROPIC_MODEL = userConfig.ANTHROPIC_MODEL;
  if (userConfig.OLLAMA_URL !== undefined) updates.OLLAMA_URL = userConfig.OLLAMA_URL;
  if (userConfig.OLLAMA_MODEL !== undefined) updates.OLLAMA_MODEL = userConfig.OLLAMA_MODEL;
  if (userConfig.CUSTOM_LLM_URL !== undefined) updates.CUSTOM_LLM_URL = userConfig.CUSTOM_LLM_URL;
  if (userConfig.CUSTOM_LLM_API_KEY !== undefined) updates.CUSTOM_LLM_API_KEY = userConfig.CUSTOM_LLM_API_KEY;
  if (userConfig.CUSTOM_MODEL !== undefined) updates.CUSTOM_MODEL = userConfig.CUSTOM_MODEL;
  if (userConfig.DISABLE_IMAGE_GENERATION !== undefined) updates.DISABLE_IMAGE_GENERATION = userConfig.DISABLE_IMAGE_GENERATION;
  if (userConfig.PIXABAY_API_KEY !== undefined) updates.PIXABAY_API_KEY = userConfig.PIXABAY_API_KEY;
  if (userConfig.IMAGE_PROVIDER !== undefined) updates.IMAGE_PROVIDER = userConfig.IMAGE_PROVIDER;
  if (userConfig.PEXELS_API_KEY !== undefined) updates.PEXELS_API_KEY = userConfig.PEXELS_API_KEY;
  if (userConfig.COMFYUI_URL !== undefined) updates.COMFYUI_URL = userConfig.COMFYUI_URL;
  if (userConfig.COMFYUI_WORKFLOW !== undefined) updates.COMFYUI_WORKFLOW = userConfig.COMFYUI_WORKFLOW;
  if (userConfig.DALL_E_3_QUALITY !== undefined) updates.DALL_E_3_QUALITY = userConfig.DALL_E_3_QUALITY;
  if (userConfig.GPT_IMAGE_1_5_QUALITY !== undefined) updates.GPT_IMAGE_1_5_QUALITY = userConfig.GPT_IMAGE_1_5_QUALITY;
  if (userConfig.TOOL_CALLS !== undefined) updates.TOOL_CALLS = userConfig.TOOL_CALLS;
  if (userConfig.DISABLE_THINKING !== undefined) updates.DISABLE_THINKING = userConfig.DISABLE_THINKING;
  if (userConfig.EXTENDED_REASONING !== undefined) updates.EXTENDED_REASONING = userConfig.EXTENDED_REASONING;
  if (userConfig.WEB_GROUNDING !== undefined) updates.WEB_GROUNDING = userConfig.WEB_GROUNDING;
  if (userConfig.USE_CUSTOM_URL !== undefined) updates.USE_CUSTOM_URL = userConfig.USE_CUSTOM_URL;
  
  // For sensitive ChatGPT OAuth token fields, protect against accidental deletion:
  // If an empty string is sent but there's an existing non-empty value, preserve the existing value.
  // This prevents tokens from being accidentally cleared when partial configs are sent.
  // Only update if the incoming value is a non-empty string, or if there's no existing value to preserve.
  if (userConfig.CHATGPT_ACCESS_TOKEN !== undefined) {
    // Only update if it's a non-empty string, or if existing value is also empty/missing
    if (userConfig.CHATGPT_ACCESS_TOKEN !== "" || !existingConfig.CHATGPT_ACCESS_TOKEN) {
      updates.CHATGPT_ACCESS_TOKEN = userConfig.CHATGPT_ACCESS_TOKEN;
    }
    // If empty string is sent but existing value exists, skip the update (preserve existing)
  }
  if (userConfig.CHATGPT_REFRESH_TOKEN !== undefined) {
    if (userConfig.CHATGPT_REFRESH_TOKEN !== "" || !existingConfig.CHATGPT_REFRESH_TOKEN) {
      updates.CHATGPT_REFRESH_TOKEN = userConfig.CHATGPT_REFRESH_TOKEN;
    }
  }
  if (userConfig.CHATGPT_TOKEN_EXPIRES_AT !== undefined) {
    // For expires_at, 0 is used for clearing. Only allow clearing if there's no existing value,
    // or if it's part of an intentional logout (all token fields are being cleared together)
    const isIntentionalLogout = 
      userConfig.CHATGPT_ACCESS_TOKEN === "" && 
      userConfig.CHATGPT_REFRESH_TOKEN === "";
    
    if (userConfig.CHATGPT_TOKEN_EXPIRES_AT !== 0 || !existingConfig.CHATGPT_TOKEN_EXPIRES_AT || isIntentionalLogout) {
      updates.CHATGPT_TOKEN_EXPIRES_AT = userConfig.CHATGPT_TOKEN_EXPIRES_AT;
    }
  }
  if (userConfig.CHATGPT_ACCOUNT_ID !== undefined) updates.CHATGPT_ACCOUNT_ID = userConfig.CHATGPT_ACCOUNT_ID;
  if (userConfig.CHATGPT_MODEL !== undefined) updates.CHATGPT_MODEL = userConfig.CHATGPT_MODEL;
  
  // Merge with existing config, preserving all other fields
  const mergedConfig = {
    ...existingConfig,  // Keep all existing fields first
    ...updates          // Apply only the updates that were explicitly provided
  };
  
  fs.writeFileSync(userConfigPath, JSON.stringify(mergedConfig, null, 2));
  return NextResponse.json(mergedConfig);
}
