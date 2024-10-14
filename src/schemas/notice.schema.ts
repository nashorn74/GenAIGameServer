// src/schemas/notice.schema.ts
import { Schema, Document } from 'mongoose';

export interface Notice extends Document {
  title: string;
  contents: string;
  createdAt: Date;
  updatedAt: Date;
}

const NoticeSchema: Schema = new Schema({
  title: { type: String, required: true },
  contents: { type: String, required: true },
}, {
  timestamps: true,  // createdAt, updatedAt 자동 생성
});

export { NoticeSchema };
