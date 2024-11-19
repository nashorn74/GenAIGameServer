// src/characters/characters.controller.ts
import { Controller, Post, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { CharactersService } from './characters.service';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';

@Controller('api/users/:userId/character')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  // 캐릭터 생성
  @Post()
  async createCharacter(
    @Param('userId') userId: string,
    @Body() createCharacterDto: CreateCharacterDto,
  ) {
    const character = await this.charactersService.createCharacter(userId, createCharacterDto);
    return character;
  }

  // 특정 캐릭터 정보 조회
  @Get()
  async getCharacter(@Param('userId') userId: string) {
    const character = await this.charactersService.getCharacterByUserId(userId);
    return character;
  }

  // 캐릭터 정보 수정
  @Put()
  async updateCharacter(
    @Param('userId') userId: string,
    @Body() updateCharacterDto: UpdateCharacterDto,
  ) {
    const updatedCharacter = await this.charactersService.updateCharacter(userId, updateCharacterDto);
    return updatedCharacter;
  }

  // 캐릭터 삭제
  @Delete()
  async deleteCharacter(@Param('userId') userId: string) {
    const result = await this.charactersService.deleteCharacter(userId);
    return result;
  }

  // 캐릭터 육성
  @Post('train') 
  async startTraining(@Param('userId') userId: string) {
    await this.charactersService.startTraining(userId);
    return { status: 'Training started' };
  }

  // 캐릭터 전투 시작
  @Post('battle')
  async startBattle(@Param('userId') userId: string) {
    await this.charactersService.startBattle(userId);
    return { status: 'Battle started' };
  }
}
