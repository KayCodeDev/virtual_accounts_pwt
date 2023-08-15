FROM node:14-alpine

WORKDIR /app

COPY package.json ./

COPY . .

RUN npm install

WORKDIR /app

EXPOSE 3300
EXPOSE 3301

CMD ["node", "src/server.js"]