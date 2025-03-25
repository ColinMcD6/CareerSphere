# Use the official Node.js image as the base image for the build stage
FROM node:18 AS build

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Set environment variables
ENV VITE_API_URL=http://backend-service:4004

# Build the TypeScript code
RUN npm run build

# Use the official Nginx image as the base image for the final stage
FROM nginx:alpine

# Copy the Nginx configuration file
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built assets from the previous stage
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]