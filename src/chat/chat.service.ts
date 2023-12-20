import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { Repository } from 'typeorm';
import {RoomService} from "../room/room.service";

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private roomService: RoomService,
  ) {}

  async sendMessage(
    userId:number,
    text: string,
  ): Promise<Message> {
    const room = await this.roomService.getUserRoom(userId);
    const sender = await this.roomService.getUserById(userId);
    const message = this.messageRepository.create({ room, sender, text });
    return this.messageRepository.save(message);
  }

  async getMessages(userId:number): Promise<Message[]> {
    const room = await this.roomService.getUserRoom(userId);
    return this.messageRepository.find({ where: { room:{id:room.id} } });
  }


}
