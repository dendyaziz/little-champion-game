# Stage 1: Build static production site with Node 22 + pnpm
FROM node:22-alpine AS builder
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
ENV NODE_ENV=production
RUN pnpm run build

# Stage 2: Serve static production assets with Nginx
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html

RUN printf 'server {\n\
    listen 80;\n\
    server_name _;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    absolute_redirect off;\n\
    port_in_redirect off;\n\
\n\
    gzip on;\n\
    gzip_vary on;\n\
    gzip_min_length 1024;\n\
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml application/manifest+json;\n\
\n\
    location /_astro/ {\n\
        expires 1y;\n\
        add_header Cache-Control "public, max-age=31536000, immutable";\n\
    }\n\
\n\
    location /audio/ {\n\
        expires 30d;\n\
        add_header Cache-Control "public, max-age=2592000";\n\
    }\n\
\n\
    location / {\n\
        try_files $uri $uri/ $uri/index.html /index.html;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
