#!/usr/bin/env bash
set -euo pipefail

if [ -z "${BOT_TOKEN:-}" ]; then
  echo "BOT_TOKEN is required. Run: BOT_TOKEN=... KILO_API_KEY=... ./deploy.sh [@channel_or_-100...]"
  exit 1
fi
if [ -z "${KILO_API_KEY:-}" ]; then
  echo "KILO_API_KEY is required. Run: BOT_TOKEN=... KILO_API_KEY=... ./deploy.sh [@channel_or_-100...]"
  exit 1
fi

CHANNEL_ID="${1:-}"

cd "$(dirname "$0")"

npm install

KV_LINE=$(npx wrangler kv namespace create KV 2>&1 | grep -oE 'id = "[a-f0-9]+"')
KV_ID=$(echo "$KV_LINE" | sed -E 's/id = "([a-f0-9]+)"/\1/')
echo "KV id: $KV_ID"

sed -i "s/REPLACE_WITH_YOUR_KV_ID/$KV_ID/" wrangler.jsonc

if [ -n "$CHANNEL_ID" ]; then
  sed -i "s/\"CHANNEL_ID\": \"\"/\"CHANNEL_ID\": \"$CHANNEL_ID\"/" wrangler.jsonc
fi

printf '%s' "$BOT_TOKEN" | npx wrangler secret put BOT_TOKEN
printf '%s' "$KILO_API_KEY" | npx wrangler secret put KILO_API_KEY

DEPLOY_OUT=$(npx wrangler deploy 2>&1)
echo "$DEPLOY_OUT"

WORKER_URL=$(echo "$DEPLOY_OUT" | grep -oE 'https://[a-z0-9-]+\.workers\.dev' | head -1)

if [ -n "$WORKER_URL" ]; then
  echo "Setting Telegram webhook..."
  curl "https://api.telegram.org/bot${BOT_TOKEN}/setWebhook?url=${WORKER_URL}"
  echo ""
  echo "Done. Worker URL: $WORKER_URL"
else
  echo "Deploy finished but could not parse worker URL. Set webhook manually:"
  echo "curl \"https://api.telegram.org/bot${BOT_TOKEN}/setWebhook?url=https://<your-subdomain>.workers.dev\""
fi
