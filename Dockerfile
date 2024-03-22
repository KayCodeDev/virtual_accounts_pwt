FROM node:14-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

COPY src/ ./src/
COPY .env .env
COPY logs/ ./logs/

EXPOSE 3300
EXPOSE 3301

CMD ["node", "src/server.js"]