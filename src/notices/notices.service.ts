// src/notices/notices.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notice } from '../schemas/notice.schema';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';

@Injectable()
export class NoticesService {
  constructor(@InjectModel('Notice') private noticeModel: Model<Notice>) {}

  // 공지사항 등록
  async createNotice(createNoticeDto: CreateNoticeDto): Promise<Notice> {
    const createdNotice = new this.noticeModel(createNoticeDto);
    return createdNotice.save();
  }

  // 특정 공지사항 조회
  async getNoticeById(noticeId: string): Promise<Notice> {
    const notice = await this.noticeModel.findById(noticeId);
    if (!notice) {
      throw new NotFoundException('공지사항을 찾을 수 없습니다.');
    }
    return notice;
  }

  // 모든 공지사항 목록 조회
  async getAllNotices(): Promise<Notice[]> {
    return this.noticeModel.find().sort({ createdAt: -1 });
  }

  // 공지사항 수정
  async updateNotice(noticeId: string, updateNoticeDto: UpdateNoticeDto): Promise<Notice> {
    const updatedNotice = await this.noticeModel.findByIdAndUpdate(
      noticeId,
      { $set: updateNoticeDto },
      { new: true },  // 업데이트된 문서 반환
    );
    if (!updatedNotice) {
      throw new NotFoundException('공지사항을 찾을 수 없습니다.');
    }
    return updatedNotice;
  }

  // 공지사항 삭제
  async deleteNotice(noticeId: string): Promise<{ message: string }> {
    const result = await this.noticeModel.findByIdAndDelete(noticeId);
    if (!result) {
      throw new NotFoundException('공지사항을 찾을 수 없습니다.');
    }
    return { message: '공지사항이 성공적으로 삭제되었습니다.' };
  }
}
