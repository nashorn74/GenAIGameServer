// src/items/items.controller.ts
import { Controller, Post, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Controller('api/items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  // 아이템 생성
  @Post()
  async createItem(@Body() createItemDto: CreateItemDto) {
    const item = await this.itemsService.createItem(createItemDto);
    return item;
  }

  // 특정 아이템 정보 조회
  @Get(':id')
  async getItem(@Param('id') id: string) {
    const item = await this.itemsService.getItemById(id);
    return item;
  }

  // 전체 아이템 목록 조회
  @Get()
  async getAllItems() {
    const items = await this.itemsService.getAllItems();
    return items;
  }

  // 아이템 수정
  @Put(':id')
  async updateItem(
    @Param('id') id: string,
    @Body() updateItemDto: UpdateItemDto,
  ) {
    const updatedItem = await this.itemsService.updateItem(id, updateItemDto);
    return updatedItem;
  }

  // 아이템 삭제
  @Delete(':id')
  async deleteItem(@Param('id') id: string) {
    const result = await this.itemsService.deleteItem(id);
    return result;
  }
}
