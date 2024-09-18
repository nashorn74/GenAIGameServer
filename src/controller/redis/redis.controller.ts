import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PubSubService } from '../../service/redis/pubsub.service';

@Controller('redis')
export class RedisController {
  constructor(private readonly pubSubService: PubSubService) {}

  @Post('set')
  async setKeyValue(@Body('key') key: string, @Body('value') value: string): Promise<string> {
    await this.pubSubService.set(key, value);
    return `Key ${key} set successfully.`;
  }

  @Get('get/:key')
  async getValue(@Param('key') key: string): Promise<string> {
    const value = await this.pubSubService.get(key);
    return value || `Key ${key} not found.`;
  }
}