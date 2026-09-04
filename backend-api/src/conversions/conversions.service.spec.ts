import { Test, TestingModule } from '@nestjs/testing';
import { ConversionsService } from './conversions.service.js';

describe('ConversionsService', () => {
  let service: ConversionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConversionsService],
    }).compile();

    service = module.get<ConversionsService>(ConversionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
