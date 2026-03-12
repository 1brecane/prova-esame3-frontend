# Stage 1: Build the application
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve the application
FROM node:22-alpine AS runner

WORKDIR /app

# Install serve globally to run the application
RUN npm install -g serve

# Copy the build output from the builder stage
COPY --from=builder /app/dist ./dist

# Expose port 3000 (Railway will map this to the public port)
EXPOSE 3000

# Start the application using serve
# serve will automatically use the PORT environment variable provided by Railway
CMD ["serve", "-s", "dist"]
