#!/bin/bash
set -e

echo "Deploying HermesBot to Hugging Face Space..."

HF_TOKEN="${HF_TOKEN:?Set HF_TOKEN to deploy}"
SPACE_ID="${SPACE_ID:-$(git remote get-url origin | sed 's/.*huggingface.co\/spaces\///' | sed 's/\.git//')}"
REPO_NAME="${SPACE_ID##*/}"
HF_USERNAME="${SPACE_ID%%/*}"

if [ -z "$SPACE_ID" ]; then
    echo "Set SPACE_ID or run from a HF Space repo"
    exit 1
fi

if ! command -v huggingface-cli &> /dev/null; then
    pip install huggingface_hub
fi

echo "Creating or updating Space: $SPACE_ID"
huggingface-cli repo create "$REPO_NAME" --repo-type space --space-sdk docker --token "$HF_TOKEN" || true

echo "Pushing files..."
huggingface-cli upload ./ "$SPACE_ID" --repo-type space --token "$HF_TOKEN"

echo ""
echo "Done! Your Space is live at:"
echo "https://huggingface.co/spaces/$SPACE_ID"
echo ""
echo "Next steps:"
echo "1. Go to Space -> Settings -> Variables and Secrets"
echo "2. Add all secrets from scripts/setup-secrets.sh"
echo "3. Restart Space"
