FROM node:22-alpine AS base
RUN apk add --no-cache yt-dlp ffmpeg
RUN corepack enable

FROM base AS builder
ENV PNPM_CONFIG_STORE_SECURITY=false
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile && pnpm build

FROM base AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
RUN mkdir -p downloads

EXPOSE 8000
CMD ["node", "dist/app/index.js"]
