FROM node:22.23.0-alpine AS frontend
WORKDIR /src/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM golang:1.27.1-alpine AS backend
WORKDIR /src/backend
COPY backend/go.mod backend/go.sum ./
RUN go mod download
COPY backend/ ./
RUN CGO_ENABLED=0 go build -trimpath -ldflags='-s -w' -o /common .

FROM alpine:3.22
RUN apk add --no-cache ca-certificates tzdata && adduser -D -u 10001 common
WORKDIR /app
COPY --from=backend /common /app/common
COPY --from=frontend /src/frontend/out /app/public
ENV STATIC_DIR=/app/public PORT=8080
USER common
EXPOSE 8080
CMD ["/app/common"]
