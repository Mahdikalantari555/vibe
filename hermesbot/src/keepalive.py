import os
import requests
from datetime import datetime

SPACE_ID = os.getenv("SPACE_ID")
CF_TOKEN = os.getenv("CLOUDFLARE_WORKERS_TOKEN")
POLL_INTERVAL = 300


def keep_alive():
    if not SPACE_ID:
        return
    url = f"https://{SPACE_ID}.hf.space"
    try:
        requests.get(url, timeout=10)
        print(f"[KeepAlive] Pinged {url} @ {datetime.utcnow().isoformat()}")
    except Exception as e:
        print(f"[KeepAlive] Failed: {e}")


def deploy_cf_worker():
    if not CF_TOKEN or not SPACE_ID:
        print("[Cloudflare] Missing token or SPACE_ID, skipping worker deploy")
        return
    worker_code = f"""export default {{
      async fetch(request, env) {{
        const url = new URL(request.url);
        if (url.pathname === '/ping') {{
          await fetch('https://{SPACE_ID}.hf.space');
          return new Response('OK', {{ status: 200 }});
        }}
        return new Response('Cloudflare KeepAlive', {{ status: 200 }});
      }}
    }}"""
    print("[Cloudflare] Worker deployment skipped - needs wrangler CLI or manual upload")
    print(worker_code)
