import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { AccessGuard } from '../auth/access.guard';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post('create')
  @UseGuards(AccessGuard)
  async createRoom(
    @Request() req,
    @Body()
    createRoomDto: {
      name: string;
      password: string;
      members: string[];
    },
  ) {
    const userId = req.user.id; // JWT 토큰에서 userId 추출
    return this.roomService.createRoom(
      createRoomDto.name,
      createRoomDto.password,
      userId,
    );
  }

  @Post('enter')
  @UseGuards(AccessGuard)
  async enterRoom(@Request() req, @Body() body: { roomId: number }) {
    const userId = req.user.id; // JWT 토큰에서 userId 추출
    return this.roomService.enterRoom(body.roomId, userId);
  }

  @Post('leave')
  @UseGuards(AccessGuard)
  async leaveRoom(@Request() req, @Body() body: { roomId: number }) {
    const userId = req.user.id; // JWT 토큰에서 userId 추출
    return this.roomService.leaveRoom(body.roomId, userId);
  }

  @Get('name')
  async getRoomName(@Body() roomInfo: { roomId: number; password: string }) {
    return this.roomService.getRoomName(roomInfo.roomId, roomInfo.password);
  }

  @Get('find-rooms')
  @UseGuards(AccessGuard)
  async getUserRooms(@Request() req) {
    const userId = req.user.id; // JWT 토큰에서 userId 추출
    return this.roomService.getUserRooms(userId);
  }

  @Get('members/:roomId')
  @UseGuards(AccessGuard)
  async getRoomMembers(@Param('roomId') roomId: number) {
    return this.roomService.getRoomMembers(roomId);
  }
}
