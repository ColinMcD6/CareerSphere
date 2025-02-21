# Use the official Node.js image as the base image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npm run build

# Install serve to serve the static files
RUN npm install -g serve

ENV VITE_API_URL=http://backend-service:5000

# Expose the port the app runs on
EXPOSE 80

# Start the application
CMD ["serve", "-s", "dist"]