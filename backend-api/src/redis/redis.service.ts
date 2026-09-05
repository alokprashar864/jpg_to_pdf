import { Injectable, OnModuleDestroy, MessageEvent } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { Observable } from 'rxjs';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly publisher: Redis;
  private readonly subscriber: Redis;

  constructor(private readonly configService: ConfigService) {
    const redisUrl = this.configService.get<string>('REDIS_URL', 'redis://localhost:6379');
    this.publisher = new Redis(redisUrl);
    this.subscriber = new Redis(redisUrl);
  }

  async onModuleDestroy() {
    await this.publisher.quit();
    await this.subscriber.quit();
  }

  /** Sends a PING to Redis — used by the health check to verify connectivity. */
  async ping(): Promise<string> {
    return this.publisher.ping();
  }

  async publishTaskToStream(streamKey: string, payload: any) {
    await this.publisher.xadd(streamKey, '*', 'payload', JSON.stringify(payload));
  }

  subscribeToJobEvents(jobId: string): Observable<MessageEvent> {
    return new Observable((observer) => {
      const channel = `conversion:events:${jobId}`;

      const handleMessage = (msgChannel: string, message: string) => {
        if (msgChannel === channel) {
          const data = JSON.parse(message);
          
          let eventType = 'status';
          if (data.status === 'COMPLETED') eventType = 'complete';
          if (data.status === 'FAILED') eventType = 'error';

          observer.next({ data, type: eventType } as MessageEvent);

          if (data.status === 'COMPLETED' || data.status === 'FAILED') {
            observer.complete();
          }
        }
      };

      this.subscriber.subscribe(channel, (err: any) => {
        if (err) observer.error(err);
      });

      this.subscriber.on('message', handleMessage);

      // Teardown logic when the client disconnects
      return () => {
        this.subscriber.off('message', handleMessage);
        this.subscriber.unsubscribe(channel);
      };
    });
  }
}
