// room.controller.ts
import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post('create')
  async createRoom(@Body() body: { name: string; password: number }) {
    return this.roomService.createRoom(body.name, body.password);
  }

  @Post('enter/:id')
  async enterRoom(
    @Param('id') roomId: number,
    @Body('password') password: number,
  ) {
    return this.roomService.enterRoom(roomId, password);
  }

  @Get('members/:uid')
  async getRoomByUserId(@Param('uid') uid: number) {
    return this.roomService.getRoomsByUserId(uid);
  }
  // 방의 이름을 id로 조회하는 엔드포인트
  @Get(':id')
  async getRoomById(@Param('id') roomId: number) {
    return this.roomService.getRoomById(roomId);
  }
  // 방의 맴버를 모두 조회하는 엔드포인트
  @Get(':id/members')
  async getRoomMembers(@Param('id') roomId: number) {
    return this.roomService.getRoomMembers(roomId);
  }
}
