// src/characters/dto/create-character.dto.ts
import { IsInt, IsOptional } from 'class-validator';

export class CreateCharacterDto {
  @IsInt()
  readonly race: number;

  @IsInt()
  readonly gold: number;

  @IsInt()
  readonly hp: number;

  @IsInt()
  readonly mp: number;

  @IsInt()
  readonly exp: number;

  @IsInt()
  readonly level: number;

  @IsInt()
  readonly attack_point: number;

  @IsInt()
  readonly defence_point: number;

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
