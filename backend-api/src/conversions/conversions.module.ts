import { Module } from '@nestjs/common';
import { ConversionsService } from './conversions.service.js';
import { ConversionsController } from './conversions.controller.js';

@Module({
  providers: [ConversionsService],
  controllers: [ConversionsController]
})
export class ConversionsModule {}
