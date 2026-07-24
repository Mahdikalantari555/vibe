#!/usr/bin/env bash
set -euo pipefail

if [ -z "${BOT_TOKEN:-}" ]; then
  echo "BOT_TOKEN is required. Run: BOT_TOKEN=... OPENROUTER_API_KEY=... ./deploy.sh"
  exit 1
fi
if [ -z "${OPENROUTER_API_KEY:-}" ]; then
  echo "OPENROUTER_API_KEY is required. Run: BOT_TOKEN=... OPENROUTER_API_KEY=... ./deploy.sh"
  exit 1
fi
if [ -z "${CF_ACCOUNT_ID:-}" ]; then
  echo "CF_ACCOUNT_ID is required. Run: BOT_TOKEN=... OPENROUTER_API_KEY=... CF_ACCOUNT_ID=... ./deploy.sh"
  exit 1
fi

cd "$(dirname "$0")"

npm install

KV_LINE=$(npx wrangler kv namespace create KV 2>&1 | grep -oE 'id = "[a-f0-9]+"' | head -1)
KV_ID=$(echo "$KV_LINE" | sed -E 's/id = "([a-f0-9]+)"/\1/')
echo "KV id: $KV_ID"

D1_LINE=$(npx wrangler d1 create hermesbot 2>&1 | grep -oE 'database_id = "[a-f0-9]+"' | head -1)
D1_ID=$(echo "$D1_LINE" | sed -E 's/database_id = "([a-f0-9]+)"/\1/')
echo "D1 id: $D1_ID"

sed -i "s/REPLACE_WITH_KV_ID/$KV_ID/" wrangler.jsonc
sed -i "s/REPLACE_WITH_D1_ID/$D1_ID/" wrangler.jsonc
sed -i "s/REPLACE_WITH_ACCOUNT_ID/$CF_ACCOUNT_ID/" wrangler.jsonc

npx wrangler d1 execute hermesbot --file=/dev/stdin <<'SQL'
CREATE TABLE IF NOT EXISTS conversations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  conversation_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS memories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS tools (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  enabled INTEGER DEFAULT 1,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  input TEXT,
  output TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_conversations_user ON conversations(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_memories_user ON memories(user_id, key);
SQL

printf '%s' "$BOT_TOKEN" | npx wrangler secret put TELEGRAM_BOT_TOKEN
printf '%s' "$OPENROUTER_API_KEY" | npx wrangler secret put LLM_API_KEY

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
