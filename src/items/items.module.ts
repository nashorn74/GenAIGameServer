import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { ItemSchema } from '../schemas/item.schema'; // Item 스키마 가져오기

@Module({
  imports: [
    // 'Item' 모델을 Mongoose에 등록
    MongooseModule.forFeature([{ name: 'Item', schema: ItemSchema }]),
  ],
  controllers: [ItemsController], // ItemsController 등록
  providers: [ItemsService], // ItemsService 등록
  exports: [ItemsService, MongooseModule], // 다른 모듈에서 ItemsService를 사용할 수 있게 내보내기
})
export class ItemsModule {}
