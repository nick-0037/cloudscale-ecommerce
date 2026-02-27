FROM node:22-alpine AS builder

RUN npm install -g pnpm

WORKDIR /app

# Copy workspace config files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy shared package
COPY packages/shared ./packages/shared

# Copy service
COPY services/user-service ./services/user-service

RUN pnpm install --frozen-lockfile

WORKDIR /app/services/user-service
RUN pnpm build

# Production stage
FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/services/user-service/dist ./dist
COPY --from=builder /app/services/user-service/package.json ./
COPY --from=builder /app/services/user-service/node_modules ./node_modules
COPY --from=builder /app/packages/shared ./packages/shared

EXPOSE 3000

CMD ["node", "dist/index.js"]