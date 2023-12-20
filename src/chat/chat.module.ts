import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import {RoomService} from "../room/room.service";
import {RoomModule} from "../room/room.module";
import {ChatService} from "./chat.service";
import {ChatController} from "./chat.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Message} from "./message.entity";

@Module({
  imports: [RoomModule,TypeOrmModule.forFeature([Message])],
  controllers: [ChatController],
  providers: [ChatGateway,ChatService],
  exports: [ChatGateway], // ChatGateway를 다른 모듈에서 사용할 수 있도록 추가
})
export class ChatModule {}
