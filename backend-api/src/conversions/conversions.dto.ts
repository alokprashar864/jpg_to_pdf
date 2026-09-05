import { IsEnum, IsInt, IsOptional, IsString, IsArray, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { PageSize, PageOrientation, PageMargin } from '@prisma/client';

export class ConversionSettingsDto {
  @IsEnum(PageSize)
  @IsOptional()
  pageSize?: PageSize;

  @IsEnum(PageOrientation)
  @IsOptional()
  orientation?: PageOrientation;

  @IsEnum(PageMargin)
  @IsOptional()
  margins?: PageMargin;

  @IsInt()
  @IsOptional()
  dpi?: number;
}

export class FileDto {
  @IsString()
  fileName: string;

  @IsString()
  mimeType: string;

  @IsInt()
  @Min(1)
  @Max(104857600) // 100MB limit
  sizeBytes: number;
}

export class InitiateConversionDto {
  @ValidateNested()
  @Type(() => ConversionSettingsDto)
  @IsOptional()
  settings?: ConversionSettingsDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FileDto)
  files: FileDto[];
}
