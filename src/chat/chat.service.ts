import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async sendMessage(
    roomId: number,
    sender: string,
    text: string,
  ): Promise<Message> {
    const message = this.messageRepository.create({ roomId, sender, text });
    return this.messageRepository.save(message);
  }

  async getMessagesByRoom(roomId: number): Promise<Message[]> {
    return this.messageRepository.find({ where: { roomId } });
  }
}
