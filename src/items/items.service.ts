// src/items/items.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Item } from '../schemas/item.schema';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemsService {
  constructor(@InjectModel('Item') private itemModel: Model<Item>) {}

  // 아이템 생성
  async createItem(createItemDto: CreateItemDto): Promise<Item> {
    const createdItem = new this.itemModel(createItemDto);
    return createdItem.save();
  }

  // 특정 아이템 조회
  async getItemById(itemId: string): Promise<Item> {
    const item = await this.itemModel.findById(itemId);
    if (!item) {
      throw new NotFoundException('아이템을 찾을 수 없습니다.');
    }
    return item;
  }

  // 모든 아이템 목록 조회
  async getAllItems(): Promise<Item[]> {
    return this.itemModel.find();
  }

  // 아이템 수정
  async updateItem(itemId: string, updateItemDto: UpdateItemDto): Promise<Item> {
    const updatedItem = await this.itemModel.findByIdAndUpdate(
      itemId,
      { $set: updateItemDto },
      { new: true },  // 업데이트된 정보를 반환
    );
    if (!updatedItem) {
      throw new NotFoundException('아이템을 찾을 수 없습니다.');
    }
    return updatedItem;
  }

  // 아이템 삭제
  async deleteItem(itemId: string): Promise<{ message: string }> {
    const result = await this.itemModel.findByIdAndDelete(itemId);
    if (!result) {
      throw new NotFoundException('아이템을 찾을 수 없습니다.');
    }
    return { message: '아이템이 성공적으로 삭제되었습니다.' };
  }
}
