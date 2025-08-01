# Use Node.js official image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies including dev dependencies for build
RUN npm ci

# Copy source code
COPY . .

# Run our custom build script instead of npm run build
RUN node build.js

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/index.js"]