FROM node:22-alpine

RUN apk add --no-cache yt-dlp ffmpeg

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --prod

COPY . .

RUN mkdir -p downloads

EXPOSE 8000

CMD ["pnpm", "exec", "tsx", "src/app/index.ts"]