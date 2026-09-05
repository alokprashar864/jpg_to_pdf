import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { StorageService } from '../storage/storage.service';
import * as os from 'os';

export interface HealthStatus {
  status: 'ok' | 'degraded' | 'down';
  timestamp: string;
  uptime_seconds: number;
  version: string;
  environment: string;
  host: string;
  checks: {
    database: SubsystemCheck;
    redis: SubsystemCheck;
    storage: SubsystemCheck;
  };
  system: {
    memory_used_mb: number;
    memory_total_mb: number;
    memory_usage_pct: number;
    cpu_load_1m: number;
    node_version: string;
    platform: string;
  };
}

interface SubsystemCheck {
  status: 'ok' | 'error';
  latency_ms: number;
  detail?: string;
}

@Injectable()
export class HealthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly storage: StorageService,
  ) {}

  async check(): Promise<HealthStatus> {
    const [database, redisCheck, storage] = await Promise.all([
      this.checkDatabase(),
      this.checkRedis(),
      this.checkStorage(),
    ]);

    const allOk = [database, redisCheck, storage].every(c => c.status === 'ok');
    const anyDown = [database, redisCheck, storage].some(c => c.status === 'error');

    const memUsed = process.memoryUsage().heapUsed / 1024 / 1024;
    const memTotal = os.totalmem() / 1024 / 1024;
    const cpuLoad = os.loadavg();

    return {
      status: allOk ? 'ok' : anyDown ? 'degraded' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime_seconds: Math.floor(process.uptime()),
      version: process.env.npm_package_version ?? '1.0.0',
      environment: process.env.NODE_ENV ?? 'production',
      host: os.hostname(),
      checks: {
        database,
        redis: redisCheck,
        storage,
      },
      system: {
        memory_used_mb: Math.round(memUsed),
        memory_total_mb: Math.round(memTotal),
        memory_usage_pct: Math.round((memUsed / memTotal) * 100),
        cpu_load_1m: cpuLoad[0],
        node_version: process.version,
        platform: os.platform(),
      },
    };
  }

  private async checkDatabase(): Promise<SubsystemCheck> {
    const start = Date.now();
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'ok', latency_ms: Date.now() - start };
    } catch (err: any) {
      return { status: 'error', latency_ms: Date.now() - start, detail: err.message };
    }
  }

  private async checkRedis(): Promise<SubsystemCheck> {
    const start = Date.now();
    try {
      const pong = await this.redis.ping();
      return {
        status: pong === 'PONG' ? 'ok' : 'error',
        latency_ms: Date.now() - start,
        detail: pong !== 'PONG' ? `Unexpected response: ${pong}` : undefined,
      };
    } catch (err: any) {
      return { status: 'error', latency_ms: Date.now() - start, detail: err.message };
    }
  }

  private async checkStorage(): Promise<SubsystemCheck> {
    const start = Date.now();
    try {
      await this.storage.checkBucketExists();
      return { status: 'ok', latency_ms: Date.now() - start };
    } catch (err: any) {
      return { status: 'error', latency_ms: Date.now() - start, detail: err.message };
    }
  }
}
