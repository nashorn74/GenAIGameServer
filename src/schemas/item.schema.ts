// src/schemas/item.schema.ts
import { Schema, Document } from 'mongoose';

export interface Item extends Document {
  name: string;
  type: number;         // 0 = 공격, 1 = 방어, 2 = 회복
  price: number;
  attack: number;
  defence: number;
  mp_spend: number;
  hp_recovery: number;
  mp_recovery: number;
  temp_attack: number;
  temp_defence: number;
}

const ItemSchema: Schema = new Schema({
  name: { type: String, required: true },
  type: { type: Number, required: true },  // 0 = 공격, 1 = 방어, 2 = 회복
  price: { type: Number, required: true, default: 0 },
  attack: { type: Number, required: true, default: 0 },
  defence: { type: Number, required: true, default: 0 },
  mp_spend: { type: Number, required: true, default: 0 },
  hp_recovery: { type: Number, required: true, default: 0 },
  mp_recovery: { type: Number, required: true, default: 0 },
  temp_attack: { type: Number, required: true, default: 0 },
  temp_defence: { type: Number, required: true, default: 0 },
}, {
  timestamps: true,
});

export { ItemSchema };
