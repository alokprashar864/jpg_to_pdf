package main

import (
	"context"
	"fmt"
	"io"
	"log"
	"os"
	"path/filepath"
	"sort"

	"github.com/redis/go-redis/v9"
	"worker-service/internal/consumer"
	"worker-service/internal/converter"
	"worker-service/internal/storage"
	"worker-service/internal/validator"
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

	// Setup S3 Client
	accessKey := os.Getenv("AWS_ACCESS_KEY_ID")
	secretKey := os.Getenv("AWS_SECRET_ACCESS_KEY")
	s3Endpoint := os.Getenv("S3_ENDPOINT")
	if s3Endpoint == "" {
		s3Endpoint = "http://localhost:9000"
	}
	if accessKey == "" {
		accessKey = "minioadmin"
		secretKey = "minioadmin"
	}

	region := os.Getenv("AWS_REGION")
	if region == "" {
		region = "auto"
	}
	bucketName := os.Getenv("S3_BUCKET_NAME")
	if bucketName == "" {
		bucketName = "conversions"
	}

	s3Client, err := storage.NewS3Client(context.Background(), s3Endpoint, region, accessKey, secretKey, bucketName)
	if err != nil {
		log.Fatalf("Failed to initialize S3 client: %v", err)
	}

	worker := consumer.NewWorker(rdb, "conversions:jobs", "pdf_workers", "worker-1")
	worker.InitGroup(context.Background())

	log.Println("Starting Go Worker Daemon with Real PDF Pipeline...")
	
	worker.Start(context.Background(), func(ctx context.Context, payload map[string]interface{}) error {
		jobId, ok := payload["job_id"].(string)
		if !ok {
			log.Println("Invalid job_id in payload")
			return nil
		}
		targetS3Key, ok := payload["target_s3_key"].(string)
		if !ok {
			log.Printf("Invalid target_s3_key for job %s", jobId)
			return nil
		}
		filesRaw, ok := payload["files"].([]interface{})
		if !ok {
			log.Printf("Invalid files payload for job %s", jobId)
			return nil
		}

		worker.PublishEvent(ctx, jobId, "PROCESSING", 10, "Downloading and validating images...")
		
		tempDir := filepath.Join(os.TempDir(), jobId)
		if err := os.MkdirAll(tempDir, 0755); err != nil {
			worker.PublishEvent(ctx, jobId, "FAILED", 0, "Failed to create temp directory")
			return err
		}
		defer os.RemoveAll(tempDir) // cleanup after

		var imagePaths []string

		type FileItem struct {
			Order int
			Key   string
		}
		var fileItems []FileItem
		for _, f := range filesRaw {
			fMap, ok := f.(map[string]interface{})
			if !ok {
				continue
			}
			orderFloat, _ := fMap["order"].(float64)
			key, _ := fMap["s3_key"].(string)
			fileItems = append(fileItems, FileItem{Order: int(orderFloat), Key: key})
		}
		
		sort.Slice(fileItems, func(i, j int) bool {
			return fileItems[i].Order < fileItems[j].Order
		})

		for i, item := range fileItems {
			headerBytes, err := s3Client.GetHeaderBytes(ctx, item.Key, 65535)
			if err != nil {
				worker.PublishEvent(ctx, jobId, "FAILED", 0, fmt.Sprintf("Failed to read image %d", i+1))
				return err
			}
			format, err := validator.Sniff(headerBytes)
			if err != nil {
				worker.PublishEvent(ctx, jobId, "FAILED", 0, fmt.Sprintf("Image %d validation failed: %v", i+1, err))
				return err
			}

			stream, err := s3Client.DownloadStream(ctx, item.Key)
			if err != nil {
				worker.PublishEvent(ctx, jobId, "FAILED", 0, fmt.Sprintf("Failed to download image %d", i+1))
				return err
			}
			
			localPath := filepath.Join(tempDir, fmt.Sprintf("img_%d.%s", i, format))
			outFile, err := os.Create(localPath)
			if err != nil {
				stream.Close()
				return err
			}
			io.Copy(outFile, stream)
			outFile.Close()
			stream.Close()

			imagePaths = append(imagePaths, localPath)
		}

		pageSize, ok := payload["page_size"].(string)
		if !ok { pageSize = "A4" }
		
		orientation, ok := payload["orientation"].(string)
		if !ok { orientation = "PORTRAIT" }
		
		margins, ok := payload["margins"].(string)
		if !ok { margins = "NONE" }

		worker.PublishEvent(ctx, jobId, "PROCESSING", 60, "Generating PDF...")
		
		outPath := filepath.Join(tempDir, "output.pdf")
		if err := converter.GeneratePDF(ctx, imagePaths, outPath, pageSize, orientation, margins); err != nil {
			worker.PublishEvent(ctx, jobId, "FAILED", 0, fmt.Sprintf("PDF Generation failed: %v", err))
			return err
		}

		worker.PublishEvent(ctx, jobId, "PROCESSING", 85, "Uploading PDF...")
		
		pdfFile, err := os.Open(outPath)
		if err != nil {
			worker.PublishEvent(ctx, jobId, "FAILED", 0, "Failed to read generated PDF")
			return err
		}
		defer pdfFile.Close()

		fileInfo, _ := pdfFile.Stat()
		
		if err := s3Client.UploadStream(ctx, targetS3Key, pdfFile, fileInfo.Size(), "application/pdf"); err != nil {
			worker.PublishEvent(ctx, jobId, "FAILED", 0, "Failed to upload final PDF")
			return err
		}

		worker.PublishEvent(ctx, jobId, "COMPLETED", 100, "PDF successfully generated and uploaded")
		return nil
	})
}
