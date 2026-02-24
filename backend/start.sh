#!/bin/sh
# start.sh — Backend entrypoint for Docker
# Waits for PostgreSQL to accept connections, runs migrations, then starts uvicorn.
set -e

echo "⏳ Waiting for database to be ready..."

# Extract host and port from DATABASE_URL
DB_HOST=$(echo "$DATABASE_URL" | sed -E 's|postgres(ql)?://[^@]+@([^:/]+).*|\2|')
DB_PORT=$(echo "$DATABASE_URL" | sed -E 's|postgres(ql)?://[^@]+@[^:]+:([0-9]+).*|\2|')
DB_PORT=${DB_PORT:-5432}

MAX_RETRIES=30
RETRY_COUNT=0
until nc -z "$DB_HOST" "$DB_PORT"; do
  RETRY_COUNT=$((RETRY_COUNT + 1))
  if [ "$RETRY_COUNT" -ge "$MAX_RETRIES" ]; then
    echo "❌ Database not reachable after ${MAX_RETRIES} attempts ($DB_HOST:$DB_PORT). Exiting."
    exit 1
  fi
  echo "  DB not ready yet ($DB_HOST:$DB_PORT) — retry $RETRY_COUNT/$MAX_RETRIES in 2s..."
  sleep 2
done

echo "✅ Database is ready. Running schema migrations..."
python migrate.py

echo "🚀 Starting API server..."
exec uvicorn app.main:app --host 0.0.0.0 --port 3000 --workers 2 --access-log
