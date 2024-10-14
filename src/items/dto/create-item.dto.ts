// src/items/dto/create-item.dto.ts
import { IsString, IsInt } from 'class-validator';

export class CreateItemDto {
  @IsString()
  readonly name: string;

  @IsInt()
  readonly type: number;

  @IsInt()
  readonly price: number;

  @IsInt()
  readonly attack: number;

  @IsInt()
  readonly defence: number;

  @IsInt()
  readonly mp_spend: number;

  @IsInt()
  readonly hp_recovery: number;

  @IsInt()
  readonly mp_recovery: number;

  @IsInt()
  readonly temp_attack: number;

  @IsInt()
  readonly temp_defence: number;
}
