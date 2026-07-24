# Hermes Bot

Telegram bot powered by Hermes Agent, routed through kilo.ai gateway to a free LLM model.

## Architecture

```
Telegram
  ↓
Hermes Gateway (kilo.ai)
  ↓
Hermes Agent
  ↓
kilo-auto/free Model
  ↓
Hugging Face Space
```

## Prerequisites

- Hugging Face account with a Write Access Token
- Telegram Bot Token from @BotFather
- Telegram User ID from @userinfobot
- kilo.ai API access
- Cloudflare Workers token (optional, for keepalive)

## Setup

### 1. Clone this project

```bash
git clone <repo-url> hermesbot
cd hermesbot
```

### 2. Configure secrets

Copy `secrets.env` and fill in your values:

```bash
cp secrets.env .env
# edit .env with your real tokens
```

Or set them directly as Hugging Face Space Secrets:

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_ALLOWED_USERS`
- `LLM_API_KEY`
- `LLM_MODEL`
- `GATEWAY_TOKEN`
- `HF_TOKEN`
- `CLOUDFLARE_WORKERS_TOKEN`
- `GATEWAY_PASSWORD`

### 3. Deploy to Hugging Face Space

1. Go to [huggingface.co/new-space](https://huggingface.co/new-space)
2. Select **Docker** as the SDK
3. Upload the `hermesbot` folder contents
4. Add the secrets in Settings → Variables and Secrets
5. Click **Build** and wait 5–15 minutes

### 4. Test

- Open `https://<username>-<space-name>.hf.space` for the dashboard
- Send `/start` to your Telegram bot

## Files

| File | Purpose |
|------|---------|
| `Dockerfile` | HF Space container image |
| `app/main.py` | Entry point — starts bot, dashboard, keepalive |
| `app/bot.py` | Telegram bot handlers |
| `app/gateway.py` | kilo.ai gateway LLM calls |
| `app/memory.py` | In-memory conversation storage |
| `app/keepalive.py` | Cloudflare + Space ping loop |
| `requirements.txt` | Python dependencies |
| `secrets.env` | Environment variable template |

## Costs

- Hugging Face Space: free
- Telegram Bot: free
- kilo.ai free model: free
- Cloudflare Worker: free

## Limits

The main constraint is the free tier rate limits on the kilo.ai model, not Hermes or Hugging Face.