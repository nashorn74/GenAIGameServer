//src/service/redis/pubsub.service.ts

import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PubSubService implements OnModuleDestroy {
  private readonly publisher: Redis;
  private readonly subscriber: Redis;
  private readonly client: Redis;

  constructor(private configService: ConfigService) {
    // Get the Redis URI from the ConfigService
    const redisUri = this.configService.get<string>('REDIS_URI') || 'redis://localhost:6379';

    try {
      // Connect to Redis using the Redis URI
      this.publisher = new Redis(redisUri);
      this.subscriber = new Redis(redisUri);
      this.client = new Redis(redisUri);
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      throw new Error('Redis connection failed');
    }
  }

  publish(channel: string, message: string): void {
    this.publisher.publish(channel, message).catch((err) => {
      console.error(`Failed to publish to channel ${channel}:`, err);
    });
  }

  subscribe(channel: string, callback: (message: string) => void): void {
    this.subscriber.subscribe(channel).catch((err) => {
      console.error(`Failed to subscribe to channel ${channel}:`, err);
    });

    this.subscriber.on('message', (receivedChannel, receivedMessage) => {
      if (receivedChannel === channel) {
        callback(receivedMessage);
      }
    });
  }

  async set(key: string, value: string): Promise<void> {
    try {
      await this.client.set(key, value);
    } catch (error) {
      console.error(`Failed to set key ${key}:`, error);
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (error) {
      console.error(`Failed to get key ${key}:`, error);
      return null;
    }
  }

  // Properly close Redis connections on module destroy
  onModuleDestroy() {
    this.publisher.disconnect();
    this.subscriber.disconnect();
    this.client.disconnect();
  }
}

