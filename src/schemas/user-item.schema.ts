// src/schemas/user-item.schema.ts
import { Schema, Document } from 'mongoose';
import { Item } from './item.schema';

export interface UserItem extends Document {
  userId: string;
  itemId: string;  // 아이템의 ID
  quantity: number;  // 보유 개수
  acquiredAt: Date;  // 아이템을 얻은 시간
}

const UserItemSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  itemId: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
  quantity: { type: Number, required: true, default: 1 },
  acquiredAt: { type: Date, default: Date.now },
});

export { UserItemSchema };
