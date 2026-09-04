# Build Stage
FROM golang:1.25-alpine AS builder

WORKDIR /app

# Copy module definition and source code
COPY go.mod ./
COPY . .

# Ensure go.sum is generated and dependencies are downloaded
RUN go mod tidy

# Build the static binary
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o worker cmd/main.go

# Runtime Stage
FROM alpine:latest

WORKDIR /app

# Install CA certificates for S3 HTTPS calls
RUN apk --no-cache add ca-certificates

# Copy the binary from the builder stage
COPY --from=builder /app/worker .

# Run the worker daemon
CMD ["./worker"]
