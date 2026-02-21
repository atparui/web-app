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

# ========================================
# Stage 2: Serve with nginx
# ========================================
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Remove default nginx static content
RUN rm -rf /usr/share/nginx/html/*

# Copy built app from builder (Angular output is dist/web-app by default)
COPY --from=builder /app/dist/web-app /usr/share/nginx/html

# Optional: use custom nginx config for SPA routing (base-href /web-app/ or /)
RUN echo 'server { \
    listen 80; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { try_files $uri $uri/ /index.html; } \
    location /health { return 200 ok; add_header Content-Type text/plain; } \
  }' > /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O - http://localhost:80/ | grep -q . || exit 1

CMD ["nginx", "-g", "daemon off;"]
