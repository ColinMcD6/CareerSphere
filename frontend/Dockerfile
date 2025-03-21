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

# Copy the common code from ../backend/common to ../backend/common
COPY ../backend/common ../backend/common

ENV VITE_API_URL=http://localhost:4004

# Build the TypeScript code
RUN npm run build

# Install serve to serve the static files
RUN npm install -g serve

# Start the application
CMD ["serve", "-s", "dist", "-l", "5173"]