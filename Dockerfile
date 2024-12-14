# syntax=docker/dockerfile:1
FROM node 
LABEL org.opencontainers.image.source=https://github.com/papawattu/cleanlog-ui
LABEL org.opencontainers.image.description="A simple web app log cleaning house"
LABEL org.opencontainers.image.licenses=MIT

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . .
# RUN npm run build

CMD ["node", "src/index.js"]

EXPOSE 3000