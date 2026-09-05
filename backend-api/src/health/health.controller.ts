import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  /**
   * GET /health
   * Full deep health check — returns 200 if ok, 503 if any subsystem is down.
   * Used by UptimeRobot to keep Render server alive and for monitoring dashboards.
   */
  @Get()
  async check() {
    const result = await this.healthService.check();

    // Return 503 if anything is degraded so monitors can alert
    if (result.status !== 'ok') {
      // NestJS will still serialize the body, we just change the status code
      throw Object.assign(new Error(), {
        response: result,
        status: HttpStatus.SERVICE_UNAVAILABLE,
      });
    }

    return result;
  }

  /**
   * GET /health/ping
   * Lightweight liveness probe — just returns 200 immediately.
   * Use this URL for UptimeRobot to avoid waking up DB/Redis on every ping.
   */
  @Get('ping')
  @HttpCode(HttpStatus.OK)
  ping() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime_seconds: Math.floor(process.uptime()),
    };
  }
}
