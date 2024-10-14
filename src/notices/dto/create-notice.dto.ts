// src/notices/dto/create-notice.dto.ts
import { IsString } from 'class-validator';

export class CreateNoticeDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly contents: string;
}
