import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity';
import {UsersService} from "../user/user.service";
import {User} from "../user/user.entity";

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    private userService: UsersService,
  ) {}

  async createRoom(
    name: string,
    owner: number,
  ): Promise<Room> {
    const user = await this.userService.getUserById(owner);
    const password = await this.generateUniqueRandomPassword();
    const newRoom = this.roomRepository.create({
      name,
      owner: user,
      password,
    });
    newRoom.members.push(user);
    return this.roomRepository.save(newRoom);
  }

  async enterRoom(roomId: number, userId: number): Promise<string> {
    const room = await this.roomRepository.findOne({ where: { id: roomId } });
    if (!room) {
      return 'Room not found';
    }
    const user = await this.userService.getUserById(userId);
    room.members.push(user);
    await this.roomRepository.save(room);
    return 'Entered room successfully';
  }

  async generateUniqueRandomPassword(): Promise<string> {
    const randomPassword = this.generateRandomPassword();
    const roomWithSamePassword = await this.roomRepository.findOne({ where: {password: randomPassword} });

    if (roomWithSamePassword) {
      // If a room with the generated password already exists, recursively call the function to generate a new one
      return this.generateUniqueRandomPassword();
    }

    return randomPassword;
  }

  generateRandomPassword(): string {
    const min = 100000; // 최소값 (6자리 숫자)
    const max = 999999; // 최대값 (6자리 숫자)
    return Math.floor(Math.random() * (max - min + 1)) + min + '';
  }

  async leaveRoom(roomId: number, userId: number): Promise<string> {
    const room = await this.roomRepository.findOne({ where: { id: roomId } });
    if (!room) {
      return 'Room not found';
    }
    room.members = room.members.filter((member) => member.id !== userId);
    await this.roomRepository.save(room);
    return 'Left room successfully';
  }

  async getUserRoom(userId: number): Promise<Room> {
    return await this.roomRepository.findOne({ where: { members: { id: userId } } });
  }

  async getRoomMembers(userId: number): Promise<User[]> {
    const user = await this.userService.getUserById(userId);
    const room = await this.roomRepository.findOne({
      where: { members: { id: userId } }
        , relations: ['members','owner'] });
    if (!room) {
      throw new Error('Room not found');
    }
    // room.members.forEach((member) => {
    //   if (member.id === user.id) {
    //     member.isMe = true;
    //   }
    // });
    return room.members;
  }

  async getRoomById(roomId: number): Promise<Room> {
    return await this.roomRepository.findOne({ where: { id: roomId } });
  }
}
