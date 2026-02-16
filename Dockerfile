# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port
EXPOSE 5000

# Start the application
CMD ["node", "server.js"]
