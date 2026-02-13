"""
ChatGPT OAuth Authentication Endpoints (using pi-ai OAuth service)

Proxies OAuth requests to the Node.js OAuth service that uses @mariozechner/pi-ai
"""

import aiohttp
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

CHATGPT_AUTH_PIAPI_ROUTER = APIRouter(prefix="/chatgpt-auth", tags=["ChatGPT Auth (pi-ai)"])

# OAuth service URL (Node.js service running pi-ai)
OAUTH_SERVICE_URL = "http://localhost:1456"


class LoginResponse(BaseModel):
    success: bool
    authorization_url: str
    message: Optional[str] = None


class StatusResponse(BaseModel):
    success: bool
    authenticated: bool
    credentials: Optional[dict] = None
    message: Optional[str] = None


class RefreshRequest(BaseModel):
    refresh_token: str


class RefreshResponse(BaseModel):
    success: bool
    credentials: Optional[dict] = None
    error: Optional[str] = None


@CHATGPT_AUTH_PIAPI_ROUTER.post("/login", response_model=LoginResponse)
async def chatgpt_login():
    """
    Start ChatGPT OAuth login flow using pi-ai.
    Returns the authorization URL to open in the browser.
    """
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(f"{OAUTH_SERVICE_URL}/oauth/start") as resp:
                if resp.status != 200:
                    error_text = await resp.text()
                    raise HTTPException(
                        status_code=resp.status,
                        detail=f"OAuth service error: {error_text}"
                    )
                
                data = await resp.json()
                return LoginResponse(**data)
    
    except aiohttp.ClientError as e:
        raise HTTPException(
            status_code=503,
            detail=f"Failed to connect to OAuth service: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to start OAuth flow: {str(e)}"
        )


@CHATGPT_AUTH_PIAPI_ROUTER.get("/status", response_model=StatusResponse)
async def chatgpt_status():
    """
    Check OAuth status and get credentials if available.
    """
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{OAUTH_SERVICE_URL}/oauth/status") as resp:
                if resp.status != 200:
                    error_text = await resp.text()
                    raise HTTPException(
                        status_code=resp.status,
                        detail=f"OAuth service error: {error_text}"
                    )
                
                data = await resp.json()
                return StatusResponse(**data)
    
    except aiohttp.ClientError as e:
        raise HTTPException(
            status_code=503,
            detail=f"Failed to connect to OAuth service: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to check OAuth status: {str(e)}"
        )


@CHATGPT_AUTH_PIAPI_ROUTER.post("/refresh", response_model=RefreshResponse)
async def chatgpt_refresh(request: RefreshRequest):
    """
    Refresh expired OAuth tokens using pi-ai.
    """
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{OAUTH_SERVICE_URL}/oauth/refresh",
                json={"refresh_token": request.refresh_token}
            ) as resp:
                data = await resp.json()
                
                if resp.status != 200:
                    return RefreshResponse(
                        success=False,
                        error=data.get("error", "Token refresh failed")
                    )
                
                return RefreshResponse(**data)
    
    except aiohttp.ClientError as e:
        raise HTTPException(
            status_code=503,
            detail=f"Failed to connect to OAuth service: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to refresh token: {str(e)}"
        )


@CHATGPT_AUTH_PIAPI_ROUTER.delete("/logout")
async def chatgpt_logout():
    """
    Logout and clear stored OAuth credentials.
    """
    try:
        async with aiohttp.ClientSession() as session:
            async with session.delete(f"{OAUTH_SERVICE_URL}/oauth/logout") as resp:
                if resp.status != 200:
                    error_text = await resp.text()
                    raise HTTPException(
                        status_code=resp.status,
                        detail=f"OAuth service error: {error_text}"
                    )
                
                data = await resp.json()
                return data
    
    except aiohttp.ClientError as e:
        raise HTTPException(
            status_code=503,
            detail=f"Failed to connect to OAuth service: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to logout: {str(e)}"
        )


@CHATGPT_AUTH_PIAPI_ROUTER.get("/models")
async def chatgpt_models():
    """
    Get available ChatGPT Codex models from pi-ai.
    Returns an array of model IDs (strings).
    """
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{OAUTH_SERVICE_URL}/oauth/models") as resp:
                if resp.status != 200:
                    error_text = await resp.text()
                    raise HTTPException(
                        status_code=resp.status,
                        detail=f"Failed to fetch models: {error_text}"
                    )
                
                data = await resp.json()
                if data.get("success"):
                    # Extract just the model IDs from the response
                    models = data.get("models", [])
                    model_ids = [model["id"] for model in models]
                    return model_ids
                else:
                    raise HTTPException(
                        status_code=500,
                        detail=data.get("error", "Failed to fetch models")
                    )
    
    except aiohttp.ClientError as e:
        raise HTTPException(
            status_code=503,
            detail=f"Failed to connect to OAuth service: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch models: {str(e)}"
        )


@CHATGPT_AUTH_PIAPI_ROUTER.post("/test")
async def test_chatgpt_api():
    """
    Test the Codex API to verify authentication is working
    """
    try:
        async with aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=30)) as session:
            async with session.post(f"{OAUTH_SERVICE_URL}/oauth/test") as resp:
                if resp.status != 200:
                    error_text = await resp.text()
                    raise HTTPException(
                        status_code=resp.status,
                        detail=f"Test failed: {error_text}"
                    )
                
                data = await resp.json()
                return data
    
    except aiohttp.ClientError as e:
        raise HTTPException(
            status_code=503,
            detail=f"Failed to connect to OAuth service: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to test Codex API: {str(e)}"
        )
