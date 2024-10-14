import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserItemsService } from './user-items.service';
import { UserItemsController } from './user-items.controller';
import { UserItemSchema } from '../schemas/user-item.schema'; // UserItem 스키마 가져오기
import { ItemsModule } from '../items/items.module'; // ItemsModule 가져오기

@Module({
  imports: [
    // 'UserItem' 모델을 Mongoose에 등록
    MongooseModule.forFeature([{ name: 'UserItem', schema: UserItemSchema }]),
    ItemsModule, // ItemsModule을 import하여 ItemModel 사용 가능하게 설정
  ],
  controllers: [UserItemsController], // UserItemsController 등록
  providers: [UserItemsService], // UserItemsService 등록
  exports: [UserItemsService], // 다른 모듈에서 UserItemsService를 사용할 수 있게 내보내기
})
export class UserItemsModule {}
