# Build Stage
FROM golang:1.25-alpine AS builder

# Install vips-dev and build tools for bimg (CGO)
RUN apk add --no-cache build-base vips-dev pkgconfig

WORKDIR /app

# Copy module definition and source code
COPY go.mod ./
COPY . .

# Ensure go.sum is generated and dependencies are downloaded
RUN go mod tidy

# Build the binary with CGO enabled
RUN CGO_ENABLED=1 GOOS=linux go build -o worker cmd/main.go

# Runtime Stage
FROM alpine:latest

WORKDIR /app

# Install CA certificates and vips (runtime dependencies for bimg)
RUN apk --no-cache add ca-certificates vips

# Copy the binary from the builder stage
COPY --from=builder /app/worker .

# Expose port for HTTP health check
EXPOSE 8080

# Run the worker daemon
CMD ["./worker"]
