import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Request, Req,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { AccessGuard } from '../auth/access.guard';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @UseGuards(AccessGuard)
  async createRoom(
    @Request() req,
    @Body()
    createRoomDto: {
      name: string;
    },
  ) {
    const owner = req.user.id; // JWT 토큰에서 userId 추출
    return this.roomService.createRoom(
      createRoomDto.name,
      owner,
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

  @Get()
  @UseGuards(AccessGuard)
  async getUserRoom(@Request() req) {
    const userId = req.user.id; // JWT 토큰에서 userId 추출
    return this.roomService.getUserRoom(userId);
  }

  @Get('members')
  @UseGuards(AccessGuard)
  async getRoomMembers(@Req() req) {
    const userId = req.user.id; // JWT 토큰에서 userId 추출
    return this.roomService.getRoomMembers(userId);
  }

  @Post('join/:roomId')
  @UseGuards(AccessGuard)
    async joinRoom(@Req() req, @Param('roomId') roomId:number) {
    const userId = req.user.id; // JWT 토큰에서 userId 추출
    return this.roomService.joinRoom(roomId, userId);
  }

  @Get('info/:roomId')
  @UseGuards(AccessGuard)
  async getRoomInfo(@Param('roomId') roomId: string) {
    return this.roomService.getRoomByCode(roomId);
  }

  @Get('status')
  @UseGuards(AccessGuard)
  async getRoomStatus(@Req() req) {
    const userId = req.user.id; // JWT 토큰에서 userId 추출
    return this.roomService.getRoomStatus(userId);
  }

  @Post('accept')
  @UseGuards(AccessGuard)
  async acceptInvitation(@Req() req, @Body() body) {
    const userId = req.user.id; // JWT 토큰에서 userId 추출
    const target = body.target;
    return this.roomService.acceptInvitation(userId,target);
  }

  @Post('reject')
  @UseGuards(AccessGuard)
  async rejectInvitation(@Req() req, @Body() body) {
    const userId = req.user.id; // JWT 토큰에서 userId 추출
    const target = body.target;
    return this.roomService.rejectInvitation(userId,target);
  }

}
