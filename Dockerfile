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

FROM alpine:latest AS runtime

ARG PB_VERSION=0.23.12

RUN apk add --no-cache \
    unzip \
    ca-certificates

# download and unzip PocketBase
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/

# uncomment to copy the local pb_migrations dir into the image
# COPY ./pb_migrations /pb/pb_migrations

# uncomment to copy the local pb_hooks dir into the image
# COPY ./pb_hooks /pb/pb_hooks

COPY --from=build /usr/src/app/pb_public /pb/pb_public

EXPOSE 3000

# start PocketBase
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:3000"]