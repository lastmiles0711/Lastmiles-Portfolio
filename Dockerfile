FROM node:20-slim AS build
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci || npm install

COPY . .
RUN npm run build

# ---------- runtime: Node.js (for cron fetch) + Nginx (to serve) ------------
FROM node:20-alpine

RUN apk add --no-cache nginx

# Nginx config
COPY nginx.conf /etc/nginx/http.d/default.conf

# Static build output
COPY --from=build /app/dist /usr/share/nginx/html

# Fetch script + source data files it imports
COPY --from=build /app/scripts /app/scripts
COPY --from=build /app/package.json /app/package.json

# Ensure the data directory exists (will be populated at runtime)
RUN mkdir -p /usr/share/nginx/html/data

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://127.0.0.1/ || exit 1

ENTRYPOINT ["/app/scripts/entrypoint.sh"]
