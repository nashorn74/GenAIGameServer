// src/notices/dto/update-notice.dto.ts
import { IsString } from 'class-validator';

export class UpdateNoticeDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly contents: string;
}
