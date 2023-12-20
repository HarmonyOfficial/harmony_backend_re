import {Body, Controller, Get, Param, Post, Req, UseGuards} from '@nestjs/common';
import { ChatService } from './chat.service';
import {AccessGuard} from "../auth/access.guard";

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('send')
  async sendMessage(
    @Body() sendMessageDto: { roomId: number; userId: number; text: string },
  ) {
    return this.chatService.sendMessage(
      sendMessageDto.userId,
      sendMessageDto.text,
    );
  }

  @Get('')
  @UseGuards(AccessGuard)
  async getMessagesByRoom(@Req() req) {
    const userId = req.user.id;
    return this.chatService.getMessages(userId);
  }
}
