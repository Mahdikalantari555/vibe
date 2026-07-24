import httpx
import os
from typing import AsyncGenerator, Optional
import json


class HermesGatewayClient:
    def __init__(self):
        self.base_url = os.getenv("GATEWAY_URL", "https://api.kilo.ai/api/gateway")
        self.api_key = os.getenv("GATEWAY_TOKEN")
        self.model = os.getenv("LLM_MODEL", "kilo-auto/free")
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

    async def chat_stream(self, messages: list[dict]) -> AsyncGenerator[str, None]:
        async with httpx.AsyncClient(timeout=120.0) as client:
            payload = {
                "model": self.model,
                "messages": messages,
                "stream": True,
            }
            async with client.stream(
                "POST",
                f"{self.base_url}/v1/chat/completions",
                headers=self.headers,
                json=payload,
            ) as response:
                response.raise_for_status()
                async for line in response.aiter_lines():
                    if line.startswith("data: "):
                        data = line[6:]
                        if data.strip() == "[DONE]":
                            return
                        try:
                            chunk = json.loads(data)
                            if "choices" in chunk:
                                delta = chunk["choices"][0].get("delta", {})
                                content = delta.get("content", "")
                                if content:
                                    yield content
                        except json.JSONDecodeError:
                            continue

    async def chat(self, messages: list[dict]) -> str:
        chunks = []
        async for chunk in self.chat_stream(messages):
            chunks.append(chunk)
        return "".join(chunks)
