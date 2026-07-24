# HermesBot

Telegram AI Assistant running on Hugging Face Space with Kilo auto/free model.

## Architecture

```
Telegram
    ↓
Hermes Gateway (FastAPI + python-telegram-bot)
    ↓
Kilo API Gateway -> Model: kilo-auto/free
    ↓
Hugging Face Space (hosted)
Memory ← Hugging Face Dataset
```

## Project Structure

```
hermesbot/
├── app.py                  # FastAPI entry point
├── Dockerfile             # HF Space container
├── requirements.txt       # Python dependencies
├── Procfile               # HF Space start command
├── .env.example           # Environment variables template
│
├── src/
│   ├── __init__.py
│   ├── bot.py             # Telegram bot logic
│   ├── gateway.py         # Kilo API client
│   ├── memory.py          # HF Dataset memory sync
│   └── keepalive.py       # Cloudflare keep-alive
│
├── templates/
│   └── index.html         # Dashboard
│
└── scripts/
    ├── deploy.sh          # Deploy to HF Space
    └── setup-secrets.sh   # Show required secrets
```

## Prerequisites

- [Hugging Face](https://huggingface.co) account
- Telegram bot token (from @BotFather)
- Kilo gateway token
- Cloudflare account (optional, for keep-alive worker)
- HuggingFace CLI (`pip install huggingface_hub`)

## Setup

### 1. Clone or create Space on Hugging Face

```bash
huggingface-cli repo create hermesbot --repo-type space --space-sdk docker
```

### 2. Copy files to Space

```bash
scripts/deploy.sh
```

### 3. Set Secrets

Go to your Space:
**Settings** → **Variables and secrets**

Add the following secrets:

```
TELEGRAM_BOT_TOKEN=<from @BotFather>
TELEGRAM_ALLOWED_USERS=<your Telegram user ID>
LLM_API_KEY=<Kilo gateway token>
LLM_MODEL=kilo-auto/free
GATEWAY_URL=https://api.kilo.ai/api/gateway
GATEWAY_TOKEN=<gateway auth token>
HF_TOKEN=<huggingface write token>
CLOUDFLARE_WORKERS_TOKEN=<optional cloudflare token>
```

### 4. Build

Click **Factory Rebuild** or **Restart Space**.

Wait 5-15 minutes for Docker image to build.

### 5. Test

- Web: `https://<username>-hermesbot.hf.space/`
- Telegram: Send a message to `@<botname>` → should respond

## Local Development

```bash
cp .env.example .env
python app.py
```

## Costs

- Hugging Face Space (CPU): **Free**
- Telegram Bot: **Free**
- Kilo API (kilo-auto/free): **Free**

## Memory

Conversations are stored in a Hugging Face Dataset (`MEMORY_DATASET_REPO`). The memory syncs automatically after each conversation.
