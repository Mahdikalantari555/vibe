import json
import os
from datetime import datetime
from pathlib import Path
from typing import Optional

from huggingface_hub import HfApi

HF_TOKEN = os.getenv("HF_TOKEN")
DATASET_REPO = os.getenv("MEMORY_DATASET_REPO", "hermesbot-memory")
MEMORY_DIR = Path("/tmp/memory")
MEMORY_DIR.mkdir(parents=True, exist_ok=True)


class Memory:
    def __init__(self):
        self.api = HfApi(token=HF_TOKEN)
        self.repo_id = f"{self.api.whoami()['name']}/{DATASET_REPO}"
        self._ensure_dataset()

    def _ensure_dataset(self):
        try:
            self.api.create_repo(
                repo_id=DATASET_REPO,
                repo_type="dataset",
                exist_ok=True,
                token=HF_TOKEN,
            )
        except Exception:
            pass

    def _load(self) -> list[dict]:
        path = MEMORY_DIR / "conversations.json"
        if not path.exists():
            return []
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)

    def _save(self, data: list[dict]):
        path = MEMORY_DIR / "conversations.json"
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        self._sync()

    def _sync(self):
        try:
            self.api.upload_file(
                path_or_fileobj=MEMORY_DIR / "conversations.json",
                path_in_repo="conversations.json",
                repo_id=self.repo_id,
                repo_type="dataset",
                token=HF_TOKEN,
            )
        except Exception as e:
            print(f"Memory sync failed: {e}")

    def remember(self, user_id: int, messages: list[dict]):
        data = self._load()
        data.append({
            "user_id": user_id,
            "timestamp": datetime.utcnow().isoformat(),
            "messages": messages,
        })
        self._save(data)
