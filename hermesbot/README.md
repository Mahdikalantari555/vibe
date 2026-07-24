# Hermesbot — Telegram agent on Cloudflare free tier

## Architecture

Telegram
    ↓
Webhook
    ↓
Cloudflare Worker
    ↓
Agent Runtime (OpenRouter)
    ↓
Tools (search, weather, calculator, github)
    ↓
Memory (KV + D1 + Durable Objects)

## Services used

| Service | Purpose | Free tier |
|---------|---------|-----------|
| Workers | Main runtime | 100k req/day |
| KV | Cached responses, settings | 1 GB, 100k reads/day |
| D1 | Long-term memory, conversations | 5 GB |
| Durable Objects | Working memory per user | Active |
| Cron | Scheduled broadcasts | Active |

## Setup

```bash
cd hermesbot
npm install

# Set secrets
npx wrangler secret put TELEGRAM_BOT_TOKEN
npx wrangler secret put LLM_API_KEY

# Deploy
npx wrangler deploy

# Set webhook
curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://<your-worker>.workers.dev"
```

## Development

```bash
npm run dev
```

## Agent loop

1. User sends message
2. Planner retrieves memory + history
3. LLM decides if a tool is needed
4. Tool result feeds back into LLM
5. Max 3 loops
6. Final answer sent to user

## Memory layers

- **KV**: cached responses, settings, global config
- **D1**: conversations, facts, users, tasks, documents
- **Durable Objects**: working memory per agent instance

## Notes

- Chat history limited to 20 messages
- Memory limited to 200 facts per user
- Agent loop limited to 3 iterations
- R2 is available for file storage if needed later
