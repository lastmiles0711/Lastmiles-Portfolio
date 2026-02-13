#!/bin/sh
set -e

DATA_DIR="/usr/share/nginx/html/data"
export DATA_DIR

echo "[entrypoint] Running initial data fetch…"
node /app/scripts/fetch-repos.js || echo "[entrypoint] Initial fetch failed, will retry on schedule"

# Set up cron job (every hour)
CRON_SCHEDULE="0 * * * *"
CRON_CMD="DATA_DIR=$DATA_DIR GITHUB_TOKEN=${GITHUB_TOKEN:-} /usr/local/bin/node /app/scripts/fetch-repos.js >> /var/log/fetch-repos.log 2>&1"

echo "$CRON_SCHEDULE $CRON_CMD" | crontab -

echo "[entrypoint] Cron configured: $CRON_SCHEDULE"

# Start cron in the background
crond -b -l 2

echo "[entrypoint] Starting nginx…"
exec nginx -g "daemon off;"
