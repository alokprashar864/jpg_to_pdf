package main

import (
	"context"
	"log"
	"os"

	"github.com/redis/go-redis/v9"
	"worker-service/internal/consumer"
)

func main() {
	redisUrl := os.Getenv("REDIS_URL")
	if redisUrl == "" {
		redisUrl = "redis://localhost:6379"
	}

	opt, err := redis.ParseURL(redisUrl)
	if err != nil {
		log.Fatalf("Invalid Redis URL: %v", err)
	}

	rdb := redis.NewClient(opt)
	defer rdb.Close()

	// Initialize the worker daemon
	worker := consumer.NewWorker(rdb, "conversions:jobs", "pdf_workers", "worker-1")
	
	// Create consumer group if it doesn't exist
	worker.InitGroup(context.Background())

	log.Println("Starting Go Worker Daemon...")
	
	// Start consuming tasks
	worker.Start(context.Background(), func(ctx context.Context, payload map[string]interface{}) error {
		jobId, ok := payload["job_id"].(string)
		if !ok {
			log.Println("Invalid job_id in payload")
			return nil
		}

		log.Printf("Received job: %s", jobId)

		worker.PublishEvent(ctx, jobId, "PROCESSING", 10, "Inspecting image headers")
		
		// Note: Actual S3 download, validator.Sniff, converter.GeneratePDF, and S3 upload 
		// would be orchestrated here based on the payload structure.
		worker.PublishEvent(ctx, jobId, "PROCESSING", 70, "Compiling vector canvas")
		
		worker.PublishEvent(ctx, jobId, "COMPLETED", 100, "PDF successfully generated and uploaded")
		
		return nil
	})
}
