FROM golang:1.19-alpine AS builder

WORKDIR /app

COPY go.mod ./
RUN go mod download

COPY . .
RUN go build -o /cleanlog-server ./cmd/server

FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

COPY --from=builder /cleanlog-server .

EXPOSE 8080

CMD ["./cleanlog-server"]
