# Stage 1: Install dependencies
FROM node:20-alpine AS deps

WORKDIR /app

# Skip Chromium download (puppeteer is a devDependency, not needed for build)
ENV PUPPETEER_SKIP_DOWNLOAD=true

COPY package.json package-lock.json ./

# --legacy-peer-deps: resolve peer dep conflicts
# Do NOT use --ignore-scripts: esbuild and @swc/core need postinstall to fetch Linux binaries
RUN npm ci --legacy-peer-deps

# Stage 2: Vite build (skip prerender — no browser available in CI)
FROM node:20-alpine AS vite-build

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

# Increase Node memory for large builds (CKEditor bundle is ~1.3 MB)
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Build — use shell with error capture so BuildKit shows the actual error
RUN set -e; \
    echo "=== Node: $(node -e 'console.log(process.platform, process.arch)')"; \
    echo "=== esbuild: $(./node_modules/.bin/esbuild --version 2>&1 || echo 'MISSING')"; \
    echo "=== Starting vite build ==="; \
    ./node_modules/.bin/vite build 2>&1 || { \
      echo ""; \
      echo "!!! VITE BUILD FAILED WITH EXIT CODE $? !!!"; \
      echo ""; \
      exit 1; \
    }; \
    echo "=== Vite build succeeded ==="

# Stage 3: Production — Nginx serves built assets
FROM nginx:1.27-alpine AS production

# Remove default nginx config
RUN rm -rf /etc/nginx/conf.d/default.conf

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built assets
COPY --from=vite-build /app/dist /usr/share/nginx/html

# Ensure /tmp dirs are writable (nginx.conf uses /tmp for temp paths)
RUN mkdir -p /tmp/client_temp /tmp/proxy_temp /tmp/fastcgi_temp /tmp/uwsgi_temp /tmp/scgi_temp

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
