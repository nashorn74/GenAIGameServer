import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CharactersService } from './characters.service';
import { CharactersController } from './characters.controller';
import { CharacterSchema } from '../schemas/character.schema'; // 캐릭터 스키마 가져오기

@Module({
  imports: [
    // MongooseModule로 'Character' 모델 등록
    MongooseModule.forFeature([{ name: 'Character', schema: CharacterSchema }]),
  ],
  controllers: [CharactersController],
  providers: [CharactersService],
  exports: [CharactersService], // 다른 모듈에서 CharactersService를 사용할 수 있게 내보내기
})
export class CharactersModule {}
