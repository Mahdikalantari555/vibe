import os
import httpx
import jwt
import time
import logging

logger = logging.getLogger(__name__)

GATEWAY_URL = os.environ.get("LLM_API_KEY", "https://api.kilo.ai/api/gateway")
GATEWAY_TOKEN = os.environ.get("GATEWAY_TOKEN", "")
MODEL = os.environ.get("LLM_MODEL", "kilo-auto/free")


def build_headers():
    headers = {
        "Authorization": f"Bearer {GATEWAY_TOKEN}",
        "Content-Type": "application/json",
    }
    return headers


def call_llm(messages, max_tokens=1024, temperature=0.7):
    payload = {
        "model": MODEL,
        "messages": messages,
        "max_tokens": max_tokens,
        "temperature": temperature,
    }
    try:
        with httpx.Client(timeout=60) as client:
            response = client.post(
                GATEWAY_URL,
                json=payload,
                headers=build_headers(),
            )
            response.raise_for_status()
            data = response.json()
            if "choices" in data and len(data["choices"]) > 0:
                return data["choices"][0]["message"]["content"]
            return str(data)
    except httpx.HTTPError as e:
        logger.error(f"Gateway HTTP error: {e}")
        return f"Error: {e}"
    except Exception as e:
        logger.error(f"Gateway error: {e}")
        return f"Error: {e}"


def call_llm_stream(messages, max_tokens=1024, temperature=0.7):
    payload = {
        "model": MODEL,
        "messages": messages,
        "max_tokens": max_tokens,
        "temperature": temperature,
        "stream": True,
    }
    try:
        with httpx.Client(timeout=120, headers=build_headers()) as client:
            with client.stream("POST", GATEWAY_URL, json=payload) as response:
                response.raise_for_status()
                for line in response.iter_lines():
                    if line.startswith("data: "):
                        chunk = line[6:]
                        if chunk == "[DONE]":
                            break
                        yield chunk
    except Exception as e:
        logger.error(f"Gateway stream error: {e}")
        yield f"Error: {e}"