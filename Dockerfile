# syntax=docker/dockerfile:1
FROM node AS build
LABEL org.opencontainers.image.source=https://github.com/papawattu/cleanlog-ui
LABEL org.opencontainers.image.description="A simple web app log cleaning house"
LABEL org.opencontainers.image.licenses=MIT

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . .
# RUN npm run build

RUN npm run rollup

FROM nginx:alpine AS runtime

COPY --from=build /usr/src/app/pb_public /usr/share/nginx/html

EXPOSE 80