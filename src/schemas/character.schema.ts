// src/schemas/character.schema.ts
import { Schema, Document } from 'mongoose';

export interface Character extends Document {
  userId: string;
  name: string | null;
  job: number | null; // 직업 번호 (0부터 시작)
  race: number; // 0 = 용족, 1 = 엘프족, 2 = 인간족
  gold: number;
  hp: number;
  mp: number;
  exp: number;
  level: number;
  attack_point: number;
  defence_point: number;
  attack_item_id?: number;
  defence_item1_id?: number;
  defence_item2_id?: number;
  defence_item3_id?: number;
  defence_item4_id?: number;
  defence_item5_id?: number;
}

const CharacterSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  name: { type: String, required: false, default: null },
  job: { type: Number, required: false, default: null },
  race: { type: Number, required: true },
  gold: { type: Number, required: true, default: 0 },
  hp: { type: Number, required: true, default: 0 },
  mp: { type: Number, required: true, default: 0 },
  exp: { type: Number, required: true, default: 0 },
  level: { type: Number, required: true, default: 0 },
  attack_point: { type: Number, required: true, default: 0 },
  defence_point: { type: Number, required: true, default: 0 },
  attack_item_id: { type: Number, default: null },
  defence_item1_id: { type: Number, default: null },
  defence_item2_id: { type: Number, default: null },
  defence_item3_id: { type: Number, default: null },
  defence_item4_id: { type: Number, default: null },
  defence_item5_id: { type: Number, default: null },
}, {
  timestamps: true,
});

// toJSON 메서드 추가
CharacterSchema.methods.toJSON = function () {
  const obj = this.toObject();

  if (obj.name === undefined) {
    obj.name = null;
  }
  if (obj.job === undefined) {
    obj.job = null;
  }

  return obj;
};

export { CharacterSchema };
