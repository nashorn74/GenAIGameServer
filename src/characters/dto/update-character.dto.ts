// src/characters/dto/update-character.dto.ts
import { IsInt, IsOptional } from 'class-validator';

export class UpdateCharacterDto {
  @IsOptional()
  @IsInt()
  readonly race?: number;

  @IsOptional()
  @IsInt()
  readonly gold?: number;

  @IsOptional()
  @IsInt()
  readonly hp?: number;

  @IsOptional()
  @IsInt()
  readonly mp?: number;

  @IsOptional()
  @IsInt()
  readonly exp?: number;

  @IsOptional()
  @IsInt()
  readonly level?: number;

  @IsOptional()
  @IsInt()
  readonly attack_point?: number;

  @IsOptional()
  @IsInt()
  readonly defence_point?: number;

  @IsOptional()
  @IsInt()
  readonly attack_item_id?: number;

  @IsOptional()
  @IsInt()
  readonly defence_item1_id?: number;

  @IsOptional()
  @IsInt()
  readonly defence_item2_id?: number;

  @IsOptional()
  @IsInt()
  readonly defence_item3_id?: number;

  @IsOptional()
  @IsInt()
  readonly defence_item4_id?: number;

  @IsOptional()
  @IsInt()
  readonly defence_item5_id?: number;
}
