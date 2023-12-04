import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('send')
  async sendMessage(
    @Body() sendMessageDto: { roomId: number; sender: string; text: string },
  ) {
    return this.chatService.sendMessage(
      sendMessageDto.roomId,
      sendMessageDto.sender,
      sendMessageDto.text,
    );
  }

  @Get('room/:roomId')
  async getMessagesByRoom(@Param('roomId') roomId: number) {
    return this.chatService.getMessagesByRoom(roomId);
  }
}
