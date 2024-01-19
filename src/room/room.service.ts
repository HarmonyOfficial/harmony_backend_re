import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity';
import {UsersService} from "../user/user.service";
import {User} from "../user/user.entity";
import {Task} from "../calendar/task.entity";

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
    newRoom.members = [user];
    await this.userService.updateJoinDate(owner);
    return this.roomRepository.save(newRoom);
  }

  async enterRoom(roomId: number, userId: number): Promise<string> {
    const room = await this.roomRepository.findOne({ where: { id: roomId } });
    if (!room) {
      return 'Room not found';
    }
    const user = await this.userService.getUserById(userId);
    await this.userService.updateJoinDate(userId);
    room.members.push(user);
    await this.roomRepository.save(room);
    return 'Entered room successfully';
  }

  async joinRoom(roomId: number, userId: number): Promise<Room> {
    const room = await this.roomRepository.findOne({ where: { id: roomId }, relations: ['pendingUsers','members','owner'] });
    if (!room) {
      throw new Error('Room not found');
    }
    const user = await this.userService.getUserById(userId);
    room.pendingUsers.push(user);
    return this.roomRepository.save(room);
  }

  async generateUniqueRandomPassword(): Promise<string> {
    const randomPassword = this.generateRandomPassword();
    const roomWithSamePassword = await this.roomRepository.findOne({ where: {password: randomPassword},relations: ['members','owner'] });

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

    // 사용자가 속한 방 찾기
    const userRoom = await this.roomRepository.createQueryBuilder('room')
        .leftJoinAndSelect('room.members', 'members')
        .where('members.id = :userId', { userId: userId })
        .getOne();

    if (!userRoom) {
      throw new Error('Room not found for this user');
    }

    // 방 멤버들 가져오기
    const roomMembers = await this.roomRepository.createQueryBuilder('room')
        .leftJoinAndSelect('room.members', 'members')
        .where('room.id = :roomId', { roomId: userRoom.id })
        .getOne();

    if (!roomMembers) {
      throw new Error('Room members not found');
    }

    return roomMembers.members;
  }

  async getTasks(userId: number): Promise<Task[]> {
    const room = await this.roomRepository.findOne({where: {members: {id: userId}}, relations: ['tasks']});
    return room.tasks;
  }

  async getEvents(userId: number): Promise<Task[]> {
    const room = await this.roomRepository.findOne({where: {members: {id: userId}}, relations: ['events']});
    return room.events;
  }


  async getRoomByCode(code: string): Promise<Room> {
    return await this.roomRepository.findOne({ where: { password:code},relations: ['members','owner'] });
  }

  async getPendingInvitations(userId: number) {
    const user = await this.userService.getUserById(userId);
    const room = await this.roomRepository.findOne({ where: { members: { id: user.id } },
      relations: ['pendingUsers'] });
    return room.pendingUsers;
  }

  async getUserById(id: number) {
    return await this.userService.getUserById(id);
  }

  async getRoomStatus(userId: number) {
    // if pendingUsers is not empty, return 'pending'
    // if pendingUsers is empty, return 'joined'
    const user = await this.userService.getUserById(userId);
    if(user.pendingRoom) {
      return {
        status: 'pending',
        roomId: user.pendingRoom.id,
      }
    }
  }

  async acceptInvitation(userId: number, target: number) {
    const targetUser = await this.userService.getUserById(target);

    const roomWithUser = await this.roomRepository.createQueryBuilder('room')
        .leftJoin('room.members', 'members')
        .leftJoin('room.pendingUsers', 'pendingUsers')
        .where('members.id = :userId', { userId })
        .getOne();

    const room = await this.roomRepository.findOne({ where: { id:roomWithUser.id },
      relations: ['pendingUsers','members'] });

    if (!roomWithUser) {
      throw new Error('User is not a member of any room');
    }

    const isTargetInPendingUsers = room.pendingUsers.some(user => user.id === targetUser.id);
    if (!isTargetInPendingUsers) {
      throw new Error('The target user is not in the pending users list of this room');
    }

    room.pendingUsers = room.pendingUsers.filter(user => user.id !== targetUser.id);
    room.members.push(targetUser); // targetUser를 members에 추가

    await this.roomRepository.save(room);

    return 'Accepted invitation successfully';
  }

  async rejectInvitation(userId: number, target: number) {
    const targetUser = await this.userService.getUserById(target);

    const roomWithMembers = await this.roomRepository.createQueryBuilder('room')
        .leftJoinAndSelect('room.members', 'members')
        .leftJoinAndSelect('room.pendingUsers', 'pendingUsers')
        .where('members.id = :userId', { userId: userId })
        .andWhere('pendingUsers.id = :targetId', { targetId: targetUser.id })
        .getOne();

    if (!roomWithMembers) {
      throw new Error('Room not found or invitation does not exist');
    }

    const isTargetInPendingUsers = roomWithMembers.pendingUsers.some(user => user.id === targetUser.id);
    if (!isTargetInPendingUsers) {
      throw new Error('The target user is not in the pending users list of this room');
    }
    roomWithMembers.pendingUsers = roomWithMembers.pendingUsers.filter((pendingUser) => pendingUser.id !== targetUser.id);
    await this.roomRepository.save(roomWithMembers);
    return 'Rejected invitation successfully';
  }
}
