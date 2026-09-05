import { vi, expect, describe, it, beforeEach } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { ConversionsController } from './conversions.controller';
import { ConversionsService } from './conversions.service';
import { PageSize, PageOrientation } from '@prisma/client';

describe('ConversionsController', () => {
  let controller: ConversionsController;
  let service: ConversionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConversionsController],
      providers: [
        {
          provide: ConversionsService,
          useValue: {
            createConversionJob: vi.fn().mockResolvedValue({
              jobId: 'job-123',
              uploadTargets: [{ sequenceOrder: 1, s3Key: 'key1', presignedPutUrl: 'url' }],
            }),
            deleteJob: vi.fn().mockResolvedValue({ success: true, message: 'Job and associated files securely deleted.' }),
          },
        },
      ],
    }).compile();

    controller = module.get<ConversionsController>(ConversionsController);
    service = module.get<ConversionsService>(ConversionsService);
  });

  it('should initiate conversion with 100MB limits via controller', async () => {
    // We are simulating the controller receiving a valid InitiateConversionDto
    const result = await controller.initiateConversion({
      files: [{ fileName: 'a.jpg', mimeType: 'image/jpeg', sizeBytes: 104857600 }],
      settings: {
        pageSize: PageSize.A4,
        orientation: PageOrientation.PORTRAIT,
        margins: 'NONE',
      },
    });

    expect(result.jobId).toEqual('job-123');
    expect(service.createConversionJob).toHaveBeenCalledWith(
      expect.objectContaining({
        settings: expect.objectContaining({
          pageSize: 'A4',
        })
      })
    );
  });

  it('should call deleteJob on the service when DELETE endpoint is hit', async () => {
    const result = await controller.deleteJob('job-789');

    expect(result.success).toBe(true);
    expect(result.message).toBe('Job and associated files securely deleted.');
    expect(service.deleteJob).toHaveBeenCalledWith('job-789');
  });
});
