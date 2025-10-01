# ---- Build stage ----
FROM node:22-alpine AS build

WORKDIR /app

# Install git, openssh, and pnpm
RUN apk add --no-cache git openssh && \
    corepack enable && corepack prepare pnpm@latest --activate && \
    git config --global url."https://github.com/".insteadOf "git@github.com:" && \
    git config --global url."https://".insteadOf "git://"

# Install dependencies
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build Vite app
RUN pnpm run build


# ---- Serve stage ----
FROM node:22-alpine AS production

WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Copy build output
COPY --from=build /app/dist ./dist

# Copy locales for i18n support
COPY --from=build /app/public/locales ./dist/locales

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 4173

ENTRYPOINT ["/entrypoint.sh"]
