// src/notices/notices.controller.ts
import { Controller, Post, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { NoticesService } from './notices.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';

@Controller('api/notices')
export class NoticesController {
  constructor(private readonly noticesService: NoticesService) {}

  // 공지사항 등록
  @Post()
  async createNotice(@Body() createNoticeDto: CreateNoticeDto) {
    const notice = await this.noticesService.createNotice(createNoticeDto);
    return notice;
  }

  // 특정 공지사항 조회
  @Get(':id')
  async getNotice(@Param('id') id: string) {
    const notice = await this.noticesService.getNoticeById(id);
    return notice;
  }

  // 공지사항 목록 조회
  @Get()
  async getAllNotices() {
    const notices = await this.noticesService.getAllNotices();
    return notices;
  }

  // 공지사항 수정
  @Put(':id')
  async updateNotice(
    @Param('id') id: string,
    @Body() updateNoticeDto: UpdateNoticeDto,
  ) {
    const updatedNotice = await this.noticesService.updateNotice(id, updateNoticeDto);
    return updatedNotice;
  }

  // 공지사항 삭제
  @Delete(':id')
  async deleteNotice(@Param('id') id: string) {
    const result = await this.noticesService.deleteNotice(id);
    return result;
  }
}
