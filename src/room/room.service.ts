import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}

  private async generateUniqueRoomId(): Promise<number> {
    let roomId;
    let isUnique = false;
    while (!isUnique) {
      roomId = this.generateRandomId();
      const existingRoom = await this.roomRepository.findOne({
        where: { id: roomId },
      });
      if (!existingRoom) {
        isUnique = true;
      }
    }
    return roomId;
  }
  generateRandomId(): any {
    throw new Error('Method not implemented.');
  }

  async createRoom(
    name: string,
    password: string,
    members: string[],
  ): Promise<Room> {
    const newRoom = this.roomRepository.create({
      id: await this.generateUniqueRoomId(), // 중복 확인 로직 추가
      name,
      password,
      members,
    });
    return this.roomRepository.save(newRoom);
  }

  async enterRoom(roomId: number, userId: string): Promise<string> {
    const room = await this.roomRepository.findOne({ where: { id: roomId } });
    if (!room) {
      return 'Room not found';
    }
    room.members.push(userId);
    await this.roomRepository.save(room);
    return 'Entered room successfully';
  }

  async leaveRoom(roomId: number, userId: string): Promise<string> {
    const room = await this.roomRepository.findOne({ where: { id: roomId } });
    if (!room) {
      return 'Room not found';
    }
    room.members = room.members.filter((memberId) => memberId !== userId);
    await this.roomRepository.save(room);
    return 'Left room successfully';
  }

  async getRoomName(roomId: number, password: string): Promise<string> {
    const room = await this.roomRepository.findOne({ where: { id: roomId } });
    if (room && room.password === password) {
      return room.name;
    } else {
      return 'Incorrect password or room not found';
    }
  }

  async getUserRooms(userId: string): Promise<Number[]> {
    const rooms = await this.roomRepository.find();
    return rooms
      .filter((room) => room.members.includes(userId))
      .map((room) => room.id);
  }

  async getRoomMembers(roomId: number): Promise<string[]> {
    const room = await this.roomRepository.findOne({ where: { id: roomId } });
    if (!room) {
      throw new Error('Room not found');
    }
    return room.members;
  }
}
