import os
import json
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

HF_TOKEN = os.environ.get("HF_TOKEN", "")
HF_REPO = os.environ.get("HF_REPO", "")

_memory_store = {}


def _get_hf_client():
    if not HF_TOKEN:
        return None
    try:
        from huggingface_hub import HfApi
        return HfApi(token=HF_TOKEN)
    except Exception:
        return None


def save_conversation(user_id, conversation):
    key = str(user_id)
    _memory_store[key] = {
        "user_id": user_id,
        "conversation": conversation,
        "updated_at": datetime.utcnow().isoformat(),
    }
    logger.info(f"Memory saved for user {user_id}")


def load_conversation(user_id):
    key = str(user_id)
    return _memory_store.get(key, {"user_id": user_id, "conversation": [], "updated_at": None})


def append_message(user_id, role, content):
    data = load_conversation(user_id)
    data["conversation"].append({"role": role, "content": content})
    save_conversation(user_id, data["conversation"])
    return data


def clear_memory(user_id):
    key = str(user_id)
    if key in _memory_store:
        del _memory_store[key]
        logger.info(f"Memory cleared for user {user_id}")
        return True
    return False


def list_users():
    return list(_memory_store.keys())