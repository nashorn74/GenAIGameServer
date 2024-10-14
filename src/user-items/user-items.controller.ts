// src/user-items/user-items.controller.ts
import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { UserItemsService } from './user-items.service';

@Controller('api/users/:userId/items')
export class UserItemsController {
  constructor(private readonly userItemsService: UserItemsService) {}

  // 아이템 구매
  @Post(':itemId')
  async buyItem(
    @Param('userId') userId: string,
    @Param('itemId') itemId: string,
    @Body('quantity') quantity: number = 1,
  ) {
    const userItem = await this.userItemsService.buyItem(userId, itemId, quantity);
    return userItem;
  }

  // 특정 사용자의 보유 아이템 목록 조회
  @Get()
  async getUserItems(@Param('userId') userId: string) {
    const userItems = await this.userItemsService.getUserItems(userId);
    return userItems;
  }

  // 특정 보유 아이템 조회
  @Get(':itemId')
  async getUserItem(
    @Param('userId') userId: string,
    @Param('itemId') itemId: string,
  ) {
    const userItem = await this.userItemsService.getUserItem(userId, itemId);
    return userItem;
  }

  // 보유 아이템 사용
  @Post(':itemId/use')
  async useItem(
    @Param('userId') userId: string,
    @Param('itemId') itemId: string,
    @Body('quantity') quantity: number = 1,
  ) {
    const usedItem = await this.userItemsService.useItem(userId, itemId, quantity);
    return usedItem;
  }
}
