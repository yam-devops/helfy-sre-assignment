FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install kafkajs log4js
COPY . .
CMD ["node", "index.js"]

