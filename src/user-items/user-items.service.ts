// src/user-items/user-items.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserItem } from '../schemas/user-item.schema';
import { Item } from '../schemas/item.schema';

@Injectable()
export class UserItemsService {
  constructor(
    @InjectModel('UserItem') private readonly userItemModel: Model<UserItem>, // UserItem 모델 주입
    @InjectModel('Item') private readonly itemModel: Model<Item>, // Item 모델 주입
  ) {}

  // 아이템 구매 (보유 아이템 추가)
  async buyItem(userId: string, itemId: string, quantity: number = 1): Promise<UserItem> {
    const item = await this.itemModel.findById(itemId); // 아이템이 존재하는지 확인
    if (!item) {
      throw new NotFoundException('아이템을 찾을 수 없습니다.');
    }
    
    const existingItem = await this.userItemModel.findOne({ userId, itemId });

    // 이미 아이템을 보유한 경우, 수량만 업데이트
    if (existingItem) {
      existingItem.quantity += quantity;
      return existingItem.save();
    }

    // 새로운 아이템을 보유하는 경우
    const newUserItem = new this.userItemModel({ userId, itemId, quantity });
    return newUserItem.save();
  }

  // 특정 사용자의 보유 아이템 목록 조회
  async getUserItems(userId: string): Promise<UserItem[]> {
    return this.userItemModel.find({ userId }).populate('itemId');
  }

  // 특정 보유 아이템 조회
  async getUserItem(userId: string, itemId: string): Promise<UserItem> {
    const userItem = await this.userItemModel.findOne({ userId, itemId }).populate('itemId');
    if (!userItem) {
      throw new NotFoundException('사용자가 해당 아이템을 보유하고 있지 않습니다.');
    }
    return userItem;
  }

  // 보유 아이템 사용 (사용 후 수량 감소)
  async useItem(userId: string, itemId: string, quantity: number = 1): Promise<UserItem> {
    const userItem = await this.userItemModel.findOne({ userId, itemId });

    if (!userItem || userItem.quantity < quantity) {
      throw new NotFoundException('아이템 수량이 부족하거나 존재하지 않습니다.');
    }

    userItem.quantity -= quantity;

    if (userItem.quantity <= 0) {
      await this.userItemModel.deleteOne({ userId, itemId });
      throw new NotFoundException('아이템을 모두 사용했습니다.');
    }

    return userItem.save();
  }
}
