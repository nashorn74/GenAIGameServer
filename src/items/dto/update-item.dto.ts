// src/items/dto/update-item.dto.ts
import { IsString, IsInt, IsOptional } from 'class-validator';

export class UpdateItemDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsInt()
  readonly type?: number;

  @IsOptional()
  @IsInt()
  readonly price?: number;

  @IsOptional()
  @IsInt()
  readonly attack?: number;

  @IsOptional()
  @IsInt()
  readonly defence?: number;

  @IsOptional()
  @IsInt()
  readonly mp_spend?: number;

  @IsOptional()
  @IsInt()
  readonly hp_recovery?: number;

  @IsOptional()
  @IsInt()
  readonly mp_recovery?: number;

  @IsOptional()
  @IsInt()
  readonly temp_attack?: number;

  @IsOptional()
  @IsInt()
  readonly temp_defence?: number;
}
