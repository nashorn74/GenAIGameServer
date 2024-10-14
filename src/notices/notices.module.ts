import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NoticesService } from './notices.service';
import { NoticesController } from './notices.controller';
import { NoticeSchema } from '../schemas/notice.schema'; // Notice 스키마 가져오기

@Module({
  imports: [
    // MongooseModule을 통해 'Notice' 모델을 MongoDB에 등록
    MongooseModule.forFeature([{ name: 'Notice', schema: NoticeSchema }]),
  ],
  controllers: [NoticesController], // NoticesController 등록
  providers: [NoticesService], // NoticesService 등록
  exports: [NoticesService], // 다른 모듈에서 NoticesService를 사용할 수 있도록 내보내기
})
export class NoticesModule {}
