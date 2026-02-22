# ========================================
# Stage 1: Build Angular (Finos Web App)
# ========================================
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts && npm cache clean --force

# Copy source and build
COPY . .
RUN npm run build

# Normalize output: Angular application builder may put assets in dist/web-app/browser
RUN mkdir -p /out && (cp -r /app/dist/web-app/browser/. /out/ 2>/dev/null || cp -r /app/dist/web-app/. /out/)

# ========================================
# Stage 2: Serve with nginx
# ========================================
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Remove default nginx static content
RUN rm -rf /usr/share/nginx/html/*

# Copy built app (index.html at root)
COPY --from=builder /out /usr/share/nginx/html

# Custom nginx config for SPA routing
RUN echo 'server { \
    listen 80; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { try_files $uri $uri/ /index.html; } \
    location /health { return 200 ok; add_header Content-Type text/plain; } \
  }' > /etc/nginx/conf.d/default.conf

# Runtime env injection for OIDC/Keycloak (auth.atparui.com) and API URL
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O - http://localhost:80/ | grep -q . || exit 1

ENTRYPOINT ["/docker-entrypoint.sh"]
