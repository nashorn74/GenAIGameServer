// src/characters/characters.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Character } from '../schemas/character.schema';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { PubSubService } from '../service/redis/pubsub.service';

@Injectable()
export class CharactersService {
  constructor(
    @InjectModel('Character') private characterModel: Model<Character>,
    private readonly pubSubService: PubSubService,
  ) {}

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

  async startTraining(userId: string): Promise<void> {
    const channel = `training:${userId}`;

    // 육성 시작 메시지 전송
    this.pubSubService.publish(channel, JSON.stringify({ type: 'start' }));

    // 별도의 비동기 작업 시작
    this.runTrainingProcess(userId, channel);
  }

  private async runTrainingProcess(userId: string, channel: string): Promise<void> {
    let progress = 0;

    // 1부터 100까지 카운트 증가
    const interval = setInterval(async () => {
      progress += 1;

      // 진행 상황 전송
      this.pubSubService.publish(channel, JSON.stringify({ type: 'progress', value: progress }));

      if (progress >= 100) {
        clearInterval(interval);

        // 육성 성공/실패 결정 (예: 70% 확률로 성공)
        const isSuccess = Math.random() < 0.7;

        if (isSuccess) {
          // 캐릭터 정보 업데이트
          const character = await this.characterModel.findOne({ userId });

          const oldData = {
            exp: character.exp,
            level: character.level,
            attack_point: character.attack_point,
            defence_point: character.defence_point,
          };

          // 경험치 증가 (예: 10 ~ 50 사이 랜덤 증가)
          const expIncrease = Math.floor(Math.random() * 41) + 10;
          character.exp += expIncrease;

          // 레벨 업 체크 (예: 레벨 업에 필요한 경험치 100 기준)
          if (character.exp >= 100) {
            character.level += 1;
            character.exp -= 100;
          }

          // 공격력 또는 방어력 랜덤 증가
          if (Math.random() < 0.5) {
            // 공격력 증가
            const attackIncrease = Math.floor(Math.random() * 6) + 1; // 1 ~ 6 증가
            character.attack_point += attackIncrease;
          } else {
            // 방어력 증가
            const defenceIncrease = Math.floor(Math.random() * 6) + 1; // 1 ~ 6 증가
            character.defence_point += defenceIncrease;
          }

          await character.save();

          const newData = {
            exp: character.exp,
            level: character.level,
            attack_point: character.attack_point,
            defence_point: character.defence_point,
          };

          // 성공 메시지 전송
          this.pubSubService.publish(channel, JSON.stringify({
            type: 'result',
            success: true,
            oldData,
            newData,
          }));
        } else {
          // 실패 메시지 전송
          this.pubSubService.publish(channel, JSON.stringify({
            type: 'result',
            success: false,
          }));
        }
      }
    }, 100); // 0.1초마다 진행 상황 업데이트
  }
}
