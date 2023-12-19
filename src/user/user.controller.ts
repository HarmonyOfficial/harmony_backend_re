import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  UseGuards,
  Patch, Get,
    Request
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from './multer.config';
import { UsersService } from './user.service';
import { AccessGuard } from '../auth/access.guard';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Post('profile')
  @UseGuards(AccessGuard)
  @UseInterceptors(FileInterceptor('profile', multerConfig))
  async uploadProfile(@UploadedFile() file: Express.Multer.File, @Body() body, @Request() req) {
    const id = req.user.id;
    const imagePath = `uploads/profiles/${file.filename}`;
    return this.usersService.updateUser(id, {
      name: body.name,
      profileImage: imagePath,
    })
  }

  @Get('profile')
  @UseGuards(AccessGuard)
  async getProfile(@Request() req) {
    const id = req.user.id;
    return this.usersService.getProfile(id);
  }
}
