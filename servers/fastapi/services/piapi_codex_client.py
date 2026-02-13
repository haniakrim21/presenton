"""
ChatGPT Codex API Client using pi-ai OAuth service
This wraps the Node.js OAuth service that uses @mariozechner/pi-ai for streaming completions
"""

import aiohttp
import json
from typing import AsyncGenerator, Optional, List
from fastapi import HTTPException

OAUTH_SERVICE_URL = "http://localhost:1456"


class PiAICodexClient:
    """Client for making streaming completions using the pi-ai OAuth service"""
    
    async def stream_completion(
        self,
        model: str,
        messages: List[dict],
        response_format: Optional[dict] = None,
        max_tokens: Optional[int] = None,
    ) -> AsyncGenerator[str, None]:
        """
        Stream a completion from the Codex API using pi-ai.
        
        Args:
            model: Model ID (e.g., "gpt-5.1-codex-max")
            messages: List of message dicts with 'role' and 'content'
            response_format: Optional response format for structured output
            max_tokens: Optional max tokens
            
        Yields:
            Chunks of the completion text
        """
        try:
            payload = {
                "model": model,
                "messages": messages,
            }
            
            if response_format:
                payload["response_format"] = response_format
            
            if max_tokens:
                payload["max_tokens"] = max_tokens
            
            async with aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=300)) as session:
                async with session.post(
                    f"{OAUTH_SERVICE_URL}/codex/stream",
                    json=payload
                ) as resp:
                    if resp.status != 200:
                        error_text = await resp.text()
                        raise HTTPException(
                            status_code=resp.status,
                            detail=f"Codex API error: {error_text}"
                        )
                    
                    # Stream the response - read chunks as they arrive
                    async for chunk in resp.content.iter_any():
                        if chunk:
                            decoded = chunk.decode('utf-8')
                            if decoded:
                                yield decoded
        
        except aiohttp.ClientError as e:
            raise HTTPException(
                status_code=503,
                detail=f"Failed to connect to OAuth service: {str(e)}"
            )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Codex API error: {str(e)}"
            )
    
    async def complete(
        self,
        model: str,
        messages: List[dict],
        response_format: Optional[dict] = None,
        max_tokens: Optional[int] = None,
    ) -> str:
        """
        Get a non-streaming completion from the Codex API.
        
        Args:
            model: Model ID (e.g., "gpt-5.1-codex-max")
            messages: List of message dicts with 'role' and 'content'
            response_format: Optional response format for structured output
            max_tokens: Optional max tokens
            
        Returns:
            The complete response text
        """
        print(f"[PiAI Complete] Collecting chunks for model: {model}")
        chunks = []
        chunk_count = 0
        async for chunk in self.stream_completion(model, messages, response_format, max_tokens):
            chunk_count += 1
            chunks.append(chunk)
        
        result = ''.join(chunks)
        print(f"[PiAI Complete] Collected {chunk_count} chunks, total length: {len(result)}")
        print(f"[PiAI Complete] First 200 chars: {result[:200]}")
        return result
    
    async def complete_with_tools(
        self,
        model: str,
        messages: List[dict],
        tools: Optional[List[dict]] = None,
        max_tokens: Optional[int] = None,
    ) -> dict:
        """
        Get a complete (non-streaming) completion from the Codex API with tool support.
        
        Args:
            model: Model ID (e.g., "gpt-5.1-codex-max")
            messages: List of message dicts with 'role' and 'content'
            tools: Optional list of tools in OpenAI format
            max_tokens: Optional max tokens
            
        Returns:
            Dict with 'content' (text), 'tool_calls' (list), and 'usage' (dict)
        """
        try:
            payload = {
                "model": model,
                "messages": messages,
            }
            
            if tools:
                payload["tools"] = tools
            
            if max_tokens:
                payload["max_tokens"] = max_tokens
            
            async with aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=300)) as session:
                async with session.post(
                    f"{OAUTH_SERVICE_URL}/codex/complete",
                    json=payload
                ) as resp:
                    if resp.status != 200:
                        error_text = await resp.text()
                        raise HTTPException(
                            status_code=resp.status,
                            detail=f"Codex API error: {error_text}"
                        )
                    
                    result = await resp.json()
                    if not result.get("success"):
                        raise HTTPException(
                            status_code=500,
                            detail=result.get("error", "Unknown error")
                        )
                    
                    return {
                        "content": result.get("content", ""),
                        "tool_calls": result.get("tool_calls"),
                        "usage": result.get("usage")
                    }
        
        except aiohttp.ClientError as e:
            raise HTTPException(
                status_code=503,
                detail=f"Failed to connect to OAuth service: {str(e)}"
            )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Codex API error: {str(e)}"
            )