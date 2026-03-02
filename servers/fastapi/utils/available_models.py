from anthropic import AsyncAnthropic
from openai import AsyncOpenAI
from google import genai


_NON_CHAT_PREFIXES = (
    "text-embedding",
    "dall-e",
    "whisper",
    "tts",
    "davinci",
    "babbage",
    "curie",
    "ada",
    "moderation",
    "omni-moderation",
)
_NON_CHAT_SUFFIXES = ("-instruct", "-search", "-similarity", "-edit")
_NON_CHAT_SUBSTRINGS = ("embedding", "realtime", "transcription", "audio")


def _is_likely_chat_model(model_id: str) -> bool:
    mid = model_id.lower()
    if mid.startswith(_NON_CHAT_PREFIXES):
        return False
    if any(mid.endswith(s) for s in _NON_CHAT_SUFFIXES):
        return False
    if any(sub in mid for sub in _NON_CHAT_SUBSTRINGS):
        return False
    return True


async def list_available_openai_compatible_models(url: str, api_key: str) -> list[str]:
    client = AsyncOpenAI(api_key=api_key, base_url=url)
    models = (await client.models.list()).data
    if models:
        all_ids = [m.id for m in models]
        chat_ids = [mid for mid in all_ids if _is_likely_chat_model(mid)]
        return chat_ids if chat_ids else all_ids
    return []


async def list_available_anthropic_models(api_key: str) -> list[str]:
    client = AsyncAnthropic(api_key=api_key)
    return list(map(lambda x: x.id, (await client.models.list(limit=50)).data))


async def list_available_google_models(api_key: str) -> list[str]:
    client = genai.Client(api_key=api_key)
    return list(map(lambda x: x.name, client.models.list(config={"page_size": 50})))
