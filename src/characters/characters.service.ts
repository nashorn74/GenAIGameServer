// src/characters/characters.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Character } from '../schemas/character.schema';
import { UserItem } from '../schemas/user-item.schema';
import { Item } from '../schemas/item.schema';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { PubSubService } from '../service/redis/pubsub.service';
import { monsters } from '../data/monsters';

@Injectable()
export class CharactersService {
  constructor(
    @InjectModel('Character') private characterModel: Model<Character>,
    @InjectModel('UserItem') private userItemModel: Model<UserItem>,
    @InjectModel('Item') private itemModel: Model<Item>,
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

  // 전투 시작
  async startBattle(userId: string): Promise<void> {
    const channel = `battle:${userId}`;

    // 랜덤 몬스터 선택
    const monster = { ...monsters[Math.floor(Math.random() * monsters.length)] };

    // 캐릭터 정보 가져오기
    const character = await this.characterModel.findOne({ userId });

    if (!character) {
      this.pubSubService.publish(channel, JSON.stringify({ type: 'error', message: '캐릭터를 찾을 수 없습니다.' }));
      throw new NotFoundException('캐릭터를 찾을 수 없습니다.');
    }

    // 보유 아이템 정보 가져오기
    const userItems = await this.userItemModel.find({ userId }).populate('itemId');

    // 전투 상태 초기화
    const battleState = {
      character: {
        hp: character.hp,
        mp: character.mp,
        attack_point: character.attack_point,
        defence_point: character.defence_point,
        level: character.level,
      },
      monster,
      userItems,
    };

    // 전투 시작 메시지 전송 (몬스터 이름 포함)
    this.pubSubService.publish(channel, JSON.stringify({
      type: 'battle_start',
      monsterName: monster.name, // 몬스터 이름 추가
      characterMaxHp: battleState.character.hp,
      monsterMaxHp: battleState.monster.hp,
    }));

    // 전투 시작 (비동기 처리)
    this.runBattle(userId, battleState, channel);
  }

  // 전투 프로세스 실행
  private async runBattle(userId: string, battleState: any, channel: string): Promise<void> {
    while (battleState.character.hp > 0 && battleState.monster.hp > 0) {
      // 캐릭터의 공격
      let damage = Math.max(0, battleState.character.attack_point - battleState.monster.defence_point);
      battleState.monster.hp -= damage;
      let log = `플레이어가 ${damage}의 피해를 입혔습니다.`;

      // 상태 업데이트 메시지 전송
      this.pubSubService.publish(channel, JSON.stringify({
        type: 'update',
        characterHp: battleState.character.hp,
        monsterHp: Math.max(0, battleState.monster.hp),
        log,
      }));

      if (battleState.monster.hp <= 0) {
        break;
      }

      // 몬스터의 공격
      damage = Math.max(0, battleState.monster.attack_point - battleState.character.defence_point);
      battleState.character.hp -= damage;
      log = `몬스터가 ${damage}의 피해를 입혔습니다.`;

      // 캐릭터가 회복 아이템 사용 가능한지 체크 및 사용
      if (battleState.character.hp < 50) { // 예시: HP가 50 이하이면 회복 아이템 사용
        const healingItem = battleState.userItems.find(ui => ui.itemId.type === 2 && ui.itemId.hp_recovery > 0 && ui.quantity > 0);
        if (healingItem) {
          battleState.character.hp += healingItem.itemId.hp_recovery;
          // 아이템 사용 후 수량 감소
          healingItem.quantity -= 1;
          await healingItem.save();
          log += `\n플레이어가 ${healingItem.itemId.name}을 사용하여 HP를 ${healingItem.itemId.hp_recovery} 회복했습니다.`;
        }
      }

      // 상태 업데이트 메시지 전송
      this.pubSubService.publish(channel, JSON.stringify({
        type: 'update',
        characterHp: Math.max(0, battleState.character.hp),
        monsterHp: battleState.monster.hp,
        log,
      }));

      if (battleState.character.hp <= 0) {
        break;
      }

      // 딜레이
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 대기
    }

    // 전투 종료 처리
    if (battleState.character.hp > 0) {
      // 승리 처리
      await this.handleBattleEnd(userId, battleState, true);
    } else {
      // 패배 처리
      await this.handleBattleEnd(userId, battleState, false);
    }
  }

  // 전투 종료 처리
  private async handleBattleEnd(userId: string, battleState: any, isWin: boolean): Promise<void> {
    const channel = `battle:${userId}`;

    if (isWin) {
      // 경험치 및 골드 획득 처리
      const expGained = battleState.monster.level * 10; // 예시: 몬스터 레벨 * 10
      const goldGained = battleState.monster.level * 5; // 예시: 몬스터 레벨 * 5

      const character = await this.characterModel.findOne({ userId });

      character.exp += expGained;
      character.gold += goldGained;

      // 레벨 업 체크
      while (character.exp >= 100) {
        character.level += 1;
        character.exp -= 100;
      }

      await character.save();

      // 전투 종료 메시지 전송
      this.pubSubService.publish(channel, JSON.stringify({
        type: 'battle_end',
        win: true,
        expGained,
        goldGained,
      }));
    } else {
      // 전투 패배 처리
      this.pubSubService.publish(channel, JSON.stringify({
        type: 'battle_end',
        win: false,
      }));
    }
  }
}
