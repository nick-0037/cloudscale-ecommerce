# 1. Base Image
FROM node:22-alpine

# 2. Global Dependencies
RUN npm install -g pnpm typescript tsx

# 3. Project Configuration
WORKDIR /app
ENV CI=true

# 4. Copy and Install
COPY . .
RUN pnpm install --frozen-lockfile

# 5. Service Specific Configuration
WORKDIR /app/services/user-service

# 6. Runtime
EXPOSE 3000

# Development mode with hot-reload
CMD ["tsx", "watch", "src/index.ts"]