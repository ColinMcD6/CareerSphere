# Development
FROM node:20 AS development

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

CMD ["npm", "run", "dev"]

#Production
FROM node:20 AS production

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY --from=development /app/dist ./dist

CMD ["node", "dist/index.js"]