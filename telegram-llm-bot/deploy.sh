#!/usr/bin/env bash
set -euo pipefail

if [ -z "${BOT_TOKEN:-}" ]; then
  echo "BOT_TOKEN is required. Run: BOT_TOKEN=... ./deploy.sh"
  exit 1
fi
if [ -z "${CF_API_TOKEN:-}" ]; then
  echo "CF_API_TOKEN is required. Run: CF_API_TOKEN=... ./deploy.sh"
  exit 1
fi

cd "$(dirname "$0")"

npm install

printf '%s' "$BOT_TOKEN" | npx wrangler secret put TELEGRAM_BOT_TOKEN
printf '%s' "$LLM_API_KEY" | npx wrangler secret put LLM_API_KEY

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
