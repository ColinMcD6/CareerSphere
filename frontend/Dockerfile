# Use the official Node.js image as the base image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npm run build

# Install serve to serve the static files
RUN npm install -g serve

# Set the port environment variable
ENV PORT=80

# Include this line for deployement in GKE
ENV VITE_API_URL=http://backend-service:5000

# Start the application
CMD ["serve", "-s", "dist", "-l", "80"]