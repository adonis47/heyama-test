FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/web/package.json ./apps/web/

RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY packages/shared ./packages/shared
COPY apps/web ./apps/web
COPY tsconfig.json ./

RUN pnpm --filter @heyama/shared build
RUN pnpm --filter @heyama/web build

FROM node:18-alpine AS runner

WORKDIR /app
RUN npm install -g pnpm

COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/package.json ./apps/web/
COPY --from=builder /app/apps/web/next.config.js ./apps/web/
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
# Copier les dépendances installées pour éviter un réinstall
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web/node_modules ./apps/web/node_modules

WORKDIR /app/apps/web

EXPOSE 3000
ENV NODE_ENV=production

CMD ["pnpm", "start"]
