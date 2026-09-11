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
              delete: vi.fn().mockResolvedValue({}),
              findUnique: vi.fn(),
            },
          },
        },
        {
          provide: StorageService,
          useValue: {
            getPresignedUploadUrl: vi.fn().mockResolvedValue('url'),
            deleteObject: vi.fn().mockResolvedValue(true),
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

  it('should securely delete job and all associated files from storage', async () => {
    // Mock the findUnique response for deleteJob
    prismaService.conversionJob.findUnique = vi.fn().mockResolvedValue({
      id: 'job-456',
      outputS3Key: 'converted/job-456/output.pdf',
      files: [
        { inputS3Key: 'raw/job-456/0.jpg' },
        { inputS3Key: 'raw/job-456/1.jpg' }
      ],
    });
    
    // Mock deleteObject and delete record
    const storageService = moduleRef.get(StorageService);
    storageService.deleteObject = vi.fn().mockResolvedValue(true);
    prismaService.conversionJob.delete = vi.fn().mockResolvedValue(true);

    const result = await service.deleteJob('job-456');

    // Assert successful message
    expect(result.success).toBe(true);

    // Assert storage deletions
    expect(storageService.deleteObject).toHaveBeenCalledTimes(3);
    expect(storageService.deleteObject).toHaveBeenCalledWith('raw/job-456/0.jpg');
    expect(storageService.deleteObject).toHaveBeenCalledWith('raw/job-456/1.jpg');
    expect(storageService.deleteObject).toHaveBeenCalledWith('converted/job-456/output.pdf');

    // Assert DB deletion
    expect(prismaService.conversionJob.delete).toHaveBeenCalledWith({
      where: { id: 'job-456' },
    });
  });

  it('should throw BadRequestException when file extension does not match MIME type', async () => {
    // Mock the create call
    prismaService.conversionJob.create = vi.fn().mockResolvedValue({ id: 'job-789' });

    // Call with mismatching extension and MIME type
    await expect(
      service.createConversionJob({
        files: [{ fileName: 'malicious.php.jpg', mimeType: 'image/png', sizeBytes: 1000 }],
      })
    ).rejects.toThrow('File extension .jpg does not match declared MIME type image/png');
  });
});
