FROM python:3.11-slim

WORKDIR /app

# Install netcat (used by start.sh to wait for PostgreSQL)
RUN apt-get update && apt-get install -y --no-install-recommends netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
# Install production deps only (pytest/httpx excluded via .dockerignore-safe requirements)
RUN pip install --no-cache-dir -r requirements.txt

# Create non-root user
RUN groupadd -r appuser && useradd -r -g appuser -d /app appuser

COPY . .

# Make startup script executable
RUN chmod +x /app/start.sh

# Create uploads directory owned by appuser
RUN mkdir -p /app/uploads && chown -R appuser:appuser /app

USER appuser

EXPOSE 3000

ENTRYPOINT ["/app/start.sh"]
