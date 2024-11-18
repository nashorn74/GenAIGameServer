// src/service/chat/chat.service.ts

import { Injectable } from '@nestjs/common';
import { PubSubService } from '../redis/pubsub.service';

@Injectable()
export class ChatService {
  constructor(private readonly pubSubService: PubSubService) {
    this.subscribeToChatChannel();
  }

  private subscribeToChatChannel(): void {
    this.pubSubService.subscribe('chat', (message: string) => {
      console.log(`'chat' 채널에서 메시지 수신: ${message}`);
      // 추가로 메시지를 처리하는 로직을 여기에 작성할 수 있습니다.
    });
  }
}
