import os
import time
import threading
import logging
import httpx

logger = logging.getLogger(__name__)

CLOUDFLARE_TOKEN = os.environ.get("CLOUDFLARE_WORKERS_TOKEN", "")
KEEPALIVE_URL = os.environ.get("KEEPALIVE_URL", "")
INTERVAL_SECONDS = int(os.environ.get("KEEPALIVE_INTERVAL", "300"))


def _ping_cloudflare():
    if not CLOUDFLARE_TOKEN or not KEEPALIVE_URL:
        return
    try:
        with httpx.Client(timeout=10) as client:
            response = client.get(
                KEEPALIVE_URL,
                headers={"Authorization": f"Bearer {CLOUDFLARE_TOKEN}"},
            )
            if response.status_code == 200:
                logger.info("Cloudflare keepalive ping successful")
            else:
                logger.warning(f"Cloudflare ping returned {response.status_code}")
    except Exception as e:
        logger.error(f"Cloudflare keepalive error: {e}")


def _ping_space():
    space_url = os.environ.get("SPACE_URL", "")
    if not space_url:
        return
    try:
        with httpx.Client(timeout=10) as client:
            response = client.get(space_url)
            if response.status_code == 200:
                logger.info("Space keepalive ping successful")
            else:
                logger.warning(f"Space ping returned {response.status_code}")
    except Exception as e:
        logger.error(f"Space keepalive error: {e}")


def keepalive_loop(stop_event=None):
    logger.info(f"Keepalive started with interval {INTERVAL_SECONDS}s")
    while True:
        if stop_event and stop_event.is_set():
            break
        _ping_cloudflare()
        _ping_space()
        if stop_event:
            stop_event.wait(INTERVAL_SECONDS)
        else:
            time.sleep(INTERVAL_SECONDS)


def start_keepalive():
    stop_event = threading.Event()
    thread = threading.Thread(target=keepalive_loop, args=(stop_event,), daemon=True)
    thread.start()
    logger.info("Keepalive thread started")
    return stop_event, thread