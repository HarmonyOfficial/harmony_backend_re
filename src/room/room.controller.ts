import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post('create')
  async createRoom(
    @Body()
    createRoomDto: {
      name: string;
      password: string;
      members: number[];
    },
  ) {
    return this.roomService.createRoom(
      createRoomDto.name,
      createRoomDto.password,
      createRoomDto.members,
    );
  }

  @Post('enter')
  async enterRoom(@Body() enterRoomDto: { roomId: number; userId: number }) {
    return this.roomService.enterRoom(enterRoomDto.roomId, enterRoomDto.userId);
  }

  @Post('leave')
  async leaveRoom(@Body() leaveRoomDto: { roomId: number; userId: number }) {
    return this.roomService.leaveRoom(leaveRoomDto.roomId, leaveRoomDto.userId);
  }

  @Get('name')
  async getRoomName(@Body() roomInfo: { roomId: number; password: string }) {
    return this.roomService.getRoomName(roomInfo.roomId, roomInfo.password);
  }

  @Get('find-rooms/:uid')
  async getUserRooms(@Param('uid') userId: number) {
    return this.roomService.getUserRooms(userId);
  }

  @Get('members/:roomId')
  async getRoomMembers(@Param('roomId') roomId: number) {
    return this.roomService.getRoomMembers(roomId);
  }
}
