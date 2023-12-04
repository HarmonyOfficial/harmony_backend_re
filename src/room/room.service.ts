import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity';
import { RoomMember } from './room-member.entity';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(RoomMember)
    private roomMemberRepository: Repository<RoomMember>,
  ) {}

  async createRoom(name: string, password: number): Promise<Room> {
    const room = this.roomRepository.create({ name, password });
    return this.roomRepository.save(room);
  }

  async enterRoom(userId: number, roomId: number): Promise<RoomMember> {
    const roomMember = new RoomMember();
    roomMember.userId = userId;
    roomMember.roomId = roomId;
    return this.roomMemberRepository.save(roomMember);
  }

  async getRoomsByUserId(userId: number): Promise<Room[]> {
    return this.roomRepository.find({
      where: { members: { userId: userId } },
      relations: ['members'],
    });
  }
  // 방의 이름을 id로 조회하는 메서드
  async getRoomById(roomId: number): Promise<Room> {
    return this.roomRepository.findOne({
      where: { id: roomId },
    });
  }

  async getRoomMembers(roomId: number): Promise<RoomMember[]> {
    const room = await this.roomRepository.findOne({
      where: { id: roomId },
      relations: ['members'],
    });
    return room ? room.members : [];
  }
}
