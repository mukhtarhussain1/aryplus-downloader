# Use official Node 20 Debian slim image
FROM node:20-bookworm-slim

# Install system dependencies including FFmpeg and certificates
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package definitions
COPY package.json package-lock.json ./

# Install dependencies (including devDependencies required for next build)
RUN npm ci

# Install Playwright Chromium and required system libraries
RUN npx playwright install chromium --with-deps

# Copy the rest of the application
COPY . .

# Build Next.js production bundle
RUN npm run build

# Set runtime environment
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Ensure persistent/working downloads directory exists
RUN mkdir -p downloads

# Expose application port
EXPOSE 3000

# Start the Next.js server
CMD ["npm", "start"]
