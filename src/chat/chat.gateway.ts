import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: any, roomId: string): void {
    client.join(roomId);
  }

  @SubscribeMessage('sendMessage')
  handleMessage(data: {
    roomId: string;
    sender: string;
    message: string;
  }): void {
    this.server.to(data.roomId).emit('newMessage', data);
  }
}
