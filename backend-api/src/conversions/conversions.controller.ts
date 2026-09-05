import { Controller, Post, Get, Param, Body, Sse, MessageEvent, Delete } from '@nestjs/common';
import { ConversionsService } from './conversions.service';
import { InitiateConversionDto } from './conversions.dto';
import { Observable } from 'rxjs';

@Controller('api/v1/conversions')
export class ConversionsController {
  constructor(private readonly conversionsService: ConversionsService) {}

  @Post()
  async initiateConversion(@Body() dto: InitiateConversionDto) {
    return this.conversionsService.createConversionJob(dto);
  }

  @Post(':id/start')
  async startJob(@Param('id') id: string) {
    return this.conversionsService.startJob(id);
  }

  @Sse(':id/events')
  streamEvents(@Param('id') id: string): Observable<MessageEvent> {
    return this.conversionsService.subscribeToEvents(id);
  }

  @Delete(':id')
  async deleteJob(@Param('id') id: string) {
    return this.conversionsService.deleteJob(id);
  }
}
