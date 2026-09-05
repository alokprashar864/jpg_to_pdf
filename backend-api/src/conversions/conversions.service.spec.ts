import { vi, expect, describe, it, beforeEach } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { ConversionsService } from './conversions.service';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { RedisService } from '../redis/redis.service';
import { PageSize, PageOrientation } from '@prisma/client';

describe('ConversionsService', () => {
  let moduleRef: TestingModule;
  let service: ConversionsService;
  let redisService: RedisService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        ConversionsService,
        {
          provide: PrismaService,
          useValue: {
            conversionJob: {
              create: vi.fn().mockResolvedValue({
                id: 'job-123',
                status: 'PENDING',
                pageSize: 'A4',
                orientation: 'PORTRAIT',
                margins: 'SMALL',
                files: [{ sequenceOrder: 1, inputS3Key: 'key1' }],
              }),
              update: vi.fn().mockResolvedValue({}),
              findUnique: vi.fn(),
            },
          },
        },
        {
          provide: StorageService,
          useValue: {
            getPresignedUploadUrl: vi.fn().mockResolvedValue('url'),
          },
        },
        {
          provide: RedisService,
          useValue: {
            publishTaskToStream: vi.fn().mockResolvedValue('msg-id'),
          },
        },
      ],
    }).compile();

    service = moduleRef.get<ConversionsService>(ConversionsService);
    redisService = moduleRef.get<RedisService>(RedisService);
    prismaService = moduleRef.get<PrismaService>(PrismaService);
  });

  it('should package layout params into Redis payload when starting conversion', async () => {
    // Mock the findUnique response for startJob
    prismaService.conversionJob.findUnique = vi.fn().mockResolvedValue({
      id: 'job-123',
      status: 'CREATED',
      pageSize: 'A4',
      orientation: 'PORTRAIT',
      margins: 'SMALL',
      files: [{ sequenceOrder: 1, inputS3Key: 'key1' }],
    });
    
    // Mock verifyObjectExists for startJob
    moduleRef.get(StorageService).verifyObjectExists = vi.fn().mockResolvedValue(true);
    
    const result = await service.startJob('job-123');

    expect(result.jobId).toEqual('job-123');

    // Verify Redis payload packaging
    expect(redisService.publishTaskToStream).toHaveBeenCalledWith(
      'conversions:jobs',
      expect.objectContaining({
        job_id: 'job-123',
        page_size: 'A4',
        orientation: 'PORTRAIT',
        margins: 'SMALL',
      })
    );
  });
});
