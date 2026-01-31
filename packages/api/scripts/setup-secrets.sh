#!/bin/bash
# Cloudflare Workers secrets設定スクリプト
# 使用方法: ./scripts/setup-secrets.sh [test|production]

set -e

ENV=${1:-test}

if [[ "$ENV" != "test" && "$ENV" != "production" ]]; then
    echo "Usage: $0 [test|production]"
    exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
API_DIR="$(dirname "$SCRIPT_DIR")"
DEV_VARS_FILE="$API_DIR/.dev.vars"

if [[ ! -f "$DEV_VARS_FILE" ]]; then
    echo "Error: .dev.vars file not found at $DEV_VARS_FILE"
    echo "Please create .dev.vars file with required secrets."
    exit 1
fi

echo "Setting up Cloudflare Workers secrets for env: $ENV"
echo "Reading secrets from: $DEV_VARS_FILE"
echo ""

# 必要なsecrets一覧
SECRETS=(
    "GOOGLE_CLIENT_EMAIL"
    "GOOGLE_PRIVATE_KEY"
    "JRA_CALENDAR_ID"
    "NAR_CALENDAR_ID"
    "WORLD_CALENDAR_ID"
    "KEIRIN_CALENDAR_ID"
    "AUTORACE_CALENDAR_ID"
    "BOATRACE_CALENDAR_ID"
    "R2_ACCESS_KEY_ID"
    "R2_SECRET_ACCESS_KEY"
    "R2_BUCKET_NAME"
    "R2_ENDPOINT"
)

cd "$API_DIR"

for SECRET_NAME in "${SECRETS[@]}"; do
    # .dev.varsから値を取得
    SECRET_VALUE=$(grep "^${SECRET_NAME}=" "$DEV_VARS_FILE" | cut -d'=' -f2-)

    if [[ -z "$SECRET_VALUE" ]]; then
        echo "Warning: $SECRET_NAME not found in .dev.vars, skipping..."
        continue
    fi

    echo "Setting $SECRET_NAME..."
    # printf '%s' を使用して \n などのエスケープシーケンスをそのまま保持
    printf '%s' "$SECRET_VALUE" | wrangler secret put "$SECRET_NAME" --env "$ENV"
done

echo ""
echo "Done! Secrets have been set for env: $ENV"
echo ""
echo "Verify with: wrangler secret list --env $ENV"
