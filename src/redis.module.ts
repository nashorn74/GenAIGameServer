//src/redis.module.ts

import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { PubSubService } from './service/redis/pubsub.service';
import { RedisController } from './controller/redis/redis.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [RedisController],
  providers: [PubSubService, ConfigService],
  exports: [PubSubService],
})
export class RedisModule {}