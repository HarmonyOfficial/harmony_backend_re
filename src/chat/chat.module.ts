import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';

@Module({
  providers: [ChatGateway],
  exports: [ChatGateway], // ChatGateway를 다른 모듈에서 사용할 수 있도록 추가
})
export class ChatModule {}
