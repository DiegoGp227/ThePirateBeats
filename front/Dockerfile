FROM node:22-alpine AS base
RUN corepack enable

FROM base AS builder
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV PNPM_CONFIG_STORE_SECURITY=false
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile && pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
