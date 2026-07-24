#!/bin/bash
set -e

echo "Setting up HermesBot secrets on Hugging Face Space..."

if [ -z "$HF_TOKEN" ]; then
    echo "HF_TOKEN environment variable is not set."
    echo "Export it or run: export HF_TOKEN=hf_xxxx"
    exit 1
fi

if [ -z "$SPACE_ID" ]; then
    echo "SPACE_ID not set (e.g., username/hermesbot)"
    exit 1
fi

REQUIRED_SECRETS=(
    "TELEGRAM_BOT_TOKEN:${TELEGRAM_BOT_TOKEN:-changeme}"
    "TELEGRAM_ALLOWED_USERS:${TELEGRAM_ALLOWED_USERS:-111459810}"
    "LLM_API_KEY:${LLM_API_KEY:-changeme}"
    "LLM_MODEL:${LLM_MODEL:-kilo-auto/free}"
    "GATEWAY_URL:${GATEWAY_URL:-https://api.kilo.ai/api/gateway}"
    "GATEWAY_TOKEN:${GATEWAY_TOKEN:-changeme}"
    "HF_TOKEN:${HF_TOKEN}"
    "CLOUDFLARE_WORKERS_TOKEN:${CLOUDFLARE_WORKERS_TOKEN:-}"
)

# HuggingFace Hub CLI
if ! command -v huggingface-cli &> /dev/null; then
    echo "Installing huggingface_hub..."
    pip install huggingface_hub
fi

echo "Please add these secrets manually in:"
echo "https://huggingface.co/spaces/$SPACE_ID/settings/secrets"
echo ""
for secret in "${REQUIRED_SECRETS[@]}"; do
    key="${secret%%:*}"
    value="${secret#*:}"
    if [ "$value" = "changeme" ] || [ -z "$value" ]; then
        echo "[!] $key = <NEEDS VALUE>"
    else
        echo "[OK] $key = ${value:0:8}..."
    fi
done
