// src/characters/characters.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Character } from '../schemas/character.schema';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';

@Injectable()
export class CharactersService {
  constructor(@InjectModel('Character') private characterModel: Model<Character>) {}

  // 캐릭터 생성
  async createCharacter(userId: string, createCharacterDto: CreateCharacterDto): Promise<Character> {
    // 사용자당 하나의 캐릭터만 허용
    const existingCharacter = await this.characterModel.findOne({ userId });
    if (existingCharacter) {
      throw new ConflictException('이미 생성된 캐릭터가 있습니다.');
    }

    const createdCharacter = new this.characterModel({ ...createCharacterDto, userId });
    return createdCharacter.save();
  }

  // 특정 캐릭터 조회 (회원 ID 기반)
  async getCharacterByUserId(userId: string): Promise<Character> {
    const character = await this.characterModel.findOne({ userId });
    if (!character) {
      throw new NotFoundException('캐릭터를 찾을 수 없습니다.');
    }
    return character;
  }

  // 캐릭터 정보 수정
  async updateCharacter(userId: string, updateCharacterDto: UpdateCharacterDto): Promise<Character> {
    const updatedCharacter = await this.characterModel.findOneAndUpdate(
      { userId },
      { $set: updateCharacterDto },
      { new: true },
    );
    if (!updatedCharacter) {
      throw new NotFoundException('캐릭터를 찾을 수 없습니다.');
    }
    return updatedCharacter;
  }

  // 캐릭터 삭제
  async deleteCharacter(userId: string): Promise<{ message: string }> {
    const result = await this.characterModel.findOneAndDelete({ userId });
    if (!result) {
      throw new NotFoundException('캐릭터를 찾을 수 없습니다.');
    }
    return { message: '캐릭터가 성공적으로 삭제되었습니다.' };
  }
}
