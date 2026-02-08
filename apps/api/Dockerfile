FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/api/package.json ./apps/api/

RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY packages/shared ./packages/shared
COPY apps/api ./apps/api
COPY tsconfig.json ./

RUN pnpm --filter @heyama/shared build
RUN pnpm --filter @heyama/api build

FROM node:18-alpine AS runner

WORKDIR /app
RUN npm install -g pnpm

COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/shared/package.json ./packages/shared/
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./

# Copier les dépendances installées pour éviter les manques en production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules

RUN pnpm install --prod --frozen-lockfile

WORKDIR /app/apps/api

EXPOSE 3001
ENV NODE_ENV=production

CMD ["node", "dist/main.js"]
