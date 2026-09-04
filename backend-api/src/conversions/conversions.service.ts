import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { RedisService } from '../redis/redis.service';
import { InitiateConversionDto } from './conversions.dto';
import { JobStatus, PageSize, PageOrientation } from '@prisma/client';
import { mergeMap } from 'rxjs/operators';

@Injectable()
export class ConversionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
    private readonly redis: RedisService,
  ) {}

  async createConversionJob(dto: InitiateConversionDto) {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    // Create the job first to generate the UUID
    const job = await this.prisma.conversionJob.create({
      data: {
        status: JobStatus.CREATED,
        pageSize: dto.settings?.pageSize || PageSize.A4,
        orientation: dto.settings?.orientation || PageOrientation.PORTRAIT,
        dpi: dto.settings?.dpi || 150,
        expiresAt,
      },
    });

    const uploadTargets = [];
    
    // Create files linking to the job ID to form proper S3 keys
    for (let i = 0; i < dto.files.length; i++) {
      const file = dto.files[i];
      const extension = file.fileName.split('.').pop() || 'jpg';
      const s3Key = `raw/${job.id}/${i}.${extension}`;
      
      await this.prisma.jobFile.create({
        data: {
          jobId: job.id,
          sequenceOrder: i,
          fileName: file.fileName,
          mimeType: file.mimeType,
          sizeBytes: BigInt(file.sizeBytes),
          inputS3Key: s3Key,
        }
      });

      const presignedPutUrl = await this.storage.generatePresignedPutUrl(s3Key, file.mimeType);
      
      uploadTargets.push({
        sequenceOrder: i,
        s3Key,
        presignedPutUrl,
      });
    }

    return { jobId: job.id, uploadTargets };
  }

  async startJob(jobId: string) {
    const job = await this.prisma.conversionJob.findUnique({
      where: { id: jobId },
      include: { files: { orderBy: { sequenceOrder: 'asc' } } },
    });

    if (!job) throw new NotFoundException('Job not found');
    if (job.status !== JobStatus.CREATED) throw new BadRequestException(`Job is in ${job.status} state`);

    // Verify all files are uploaded
    for (const file of job.files) {
      const exists = await this.storage.verifyObjectExists(file.inputS3Key);
      if (!exists) {
        throw new BadRequestException(`File ${file.inputS3Key} has not been uploaded to storage yet.`);
      }
    }

    const targetS3Key = `converted/${job.id}/output.pdf`;

    await this.prisma.conversionJob.update({
      where: { id: jobId },
      data: { status: JobStatus.QUEUED, outputS3Key: targetS3Key },
    });

    const payload = {
      job_id: job.id,
      dpi: job.dpi,
      page_size: job.pageSize,
      orientation: job.orientation,
      target_s3_key: targetS3Key,
      files: job.files.map((f: any) => ({
        order: f.sequenceOrder,
        s3_key: f.inputS3Key,
      })),
    };

    await this.redis.publishTaskToStream('conversions:jobs', payload);

    return { status: JobStatus.QUEUED, jobId: job.id };
  }

  subscribeToEvents(jobId: string) {
    return this.redis.subscribeToJobEvents(jobId).pipe(
      mergeMap(async (event) => {
        if (event.type === 'complete') {
          const url = await this.storage.generatePresignedGetUrl(`converted/${jobId}/output.pdf`);
          event.data = { ...(event.data as any), downloadUrl: url };
        }
        return event;
      })
    );
  }
}
