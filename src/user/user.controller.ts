import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from './multer.config';
import { UsersService } from './user.service';
import { AccessGuard } from '../auth/access.guard';
@Controller('user')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Post('profileUpload')
  @UseInterceptors(FileInterceptor('profile', multerConfig))
  async uploadProfile(@UploadedFile() file: Express.Multer.File) {
    const imagePath = `uploads/profiles/${file.filename}`;
    return { path: imagePath };
  }

  @Patch('profile')
  @UseGuards(AccessGuard)
  async registerUser(@Request() req, @Body() body) {
    const id = req.user.id; // JWT 토큰에서 UID 추출
    const { name, profile_picture } = body;

    // 데이터베이스에 사용자 정보 저장
    await this.usersService.updateUser(id, {
      name: name,
      profileImage: profile_picture,
    });

    return { success: true };
  }
}
