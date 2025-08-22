# Multi-stage Dockerfile for CI
FROM node:24-bullseye-slim AS build
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@9

# Copy lock and manifest first for better caching
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --reporter=silent

# Copy source and build
COPY . .
RUN pnpm run build

# Runner image
FROM node:24-bullseye-slim AS runner
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm@9 && pnpm install --prod --frozen-lockfile --reporter=silent

# Copy built artifacts
COPY --from=build /app/lib ./lib

ENV TZ=JST
EXPOSE 3000
CMD ["node", "lib/src/index.js"]
