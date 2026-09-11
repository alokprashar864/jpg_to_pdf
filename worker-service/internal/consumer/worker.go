package consumer

import (
	"context"
	"encoding/json"
	"log"
	"time"

	"github.com/redis/go-redis/v9"
)

type Worker struct {
	rdb    *redis.Client
	stream string
	group  string
	name   string
}

func NewWorker(rdb *redis.Client, stream, group, name string) *Worker {
	return &Worker{
		rdb:    rdb,
		stream: stream,
		group:  group,
		name:   name,
	}
}

func (w *Worker) InitGroup(ctx context.Context) {
	err := w.rdb.XGroupCreateMkStream(ctx, w.stream, w.group, "0").Err()
	if err != nil {
		if err.Error() != "BUSYGROUP Consumer Group name already exists" {
			log.Printf("Error creating group: %v", err)
		}
	}
}

func (w *Worker) Start(ctx context.Context, handler func(ctx context.Context, payload map[string]interface{}) error) {
	go w.autoClaimLoop(ctx)

	for {
		select {
		case <-ctx.Done():
			return
		default:
			res, err := w.rdb.XReadGroup(ctx, &redis.XReadGroupArgs{
				Group:    w.group,
				Consumer: w.name,
				Streams:  []string{w.stream, ">"},
				Count:    1,
				Block:    5 * time.Second,
			}).Result()

			if err != nil && err != redis.Nil {
				log.Printf("Error reading from stream: %v", err)
				time.Sleep(2 * time.Second)
				continue
			}

			if len(res) > 0 && len(res[0].Messages) > 0 {
				msg := res[0].Messages[0]
				payloadStr, ok := msg.Values["payload"].(string)
				if !ok {
					w.rdb.XAck(ctx, w.stream, w.group, msg.ID)
					continue
				}

				var payload map[string]interface{}
				if err := json.Unmarshal([]byte(payloadStr), &payload); err == nil {
					if err := handler(ctx, payload); err != nil {
						log.Printf("Handler error for job: %v", err)
						if jobId, ok := payload["job_id"].(string); ok {
							w.PublishEvent(ctx, jobId, "ERROR", 0, err.Error())
						}
					}
				}
				
				w.rdb.XAck(ctx, w.stream, w.group, msg.ID)
			}
		}
	}
}

func (w *Worker) autoClaimLoop(ctx context.Context) {
	ticker := time.NewTicker(30 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			res, _, err := w.rdb.XAutoClaim(ctx, &redis.XAutoClaimArgs{
				Stream:   w.stream,
				Group:    w.group,
				Consumer: w.name,
				MinIdle:  60 * time.Second,
				Count:    10,
				Start:    "0-0",
			}).Result()

			if err != nil {
				log.Printf("AutoClaim error: %v", err)
				continue
			}

			for _, msg := range res {
				payloadStr, ok := msg.Values["payload"].(string)
				if ok {
					log.Printf("Reclaimed orphaned message: %s", payloadStr)
					// In a full implementation, we'd pipe this back to the handler channel
				}
				w.rdb.XAck(ctx, w.stream, w.group, msg.ID)
			}
		}
	}
}

func (w *Worker) PublishEvent(ctx context.Context, jobId string, status string, progress int, msg string) {
	event := map[string]interface{}{
		"status":   status,
		"progress": progress,
		"message":  msg,
	}
	data, _ := json.Marshal(event)
	w.rdb.Publish(ctx, "conversion:events:"+jobId, string(data))
}
