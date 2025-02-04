FROM node:20-alpine3.20

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY public public
COPY src src

EXPOSE 5000

ENTRYPOINT [ "node", "src/index.js" ]
