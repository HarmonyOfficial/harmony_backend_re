import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Injectable } from '@nestjs/common';

@WebSocketGateway()
@Injectable()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: any, roomId: string): void {
    client.join(roomId);
  }

  @SubscribeMessage('sendMessage')
  handleMessage(
    @MessageBody() data: { roomId: string; sender: string; message: string },
  ): void {
    this.server.to(data.roomId).emit('newMessage', data);
  }

  sendMessage(data: { roomId: string; sender: string; message: string }): void {
    this.server.to(data.roomId).emit('newMessage', data);
  }
}
