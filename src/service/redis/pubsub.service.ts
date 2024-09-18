import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PubSubService {
  private readonly publisher: Redis;
  private readonly subscriber: Redis;
  private readonly client: Redis;

  constructor(private configService: ConfigService) {
    // Get the Redis URI from the ConfigService
    const redisUri = this.configService.get<string>('REDIS_URI') || 'redis://localhost:6379';

    // Connect to Redis using the Redis URI
    this.publisher = new Redis(redisUri);
    this.subscriber = new Redis(redisUri);
    this.client = new Redis(redisUri);
  }

  publish(channel: string, message: string): void {
    this.publisher.publish(channel, message);
  }

  subscribe(channel: string, callback: (message: string) => void): void {
    this.subscriber.subscribe(channel);
    this.subscriber.on('message', (receivedChannel, receivedMessage) => {
      if (receivedChannel === channel) {
        callback(receivedMessage);
      }
    });
  }

  // Set key-value pair
  async set(key: string, value: string): Promise<void> {
    await this.client.set(key, value);
  }

  // Get value by key
  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }
}
