# Development stage
FROM node:18 AS development

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG VITE_API_URL

RUN VITE_API_URL=${VITE_API_URL} npm run build

# Production
FROM caddy:2-alpine AS production

COPY Caddyfile /etc/caddy/Caddyfile

COPY --from=development /app/dist /srv