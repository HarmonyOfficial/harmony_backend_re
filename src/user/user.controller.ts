import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from './multer.config';
import { UsersService } from './user.service';
import { JwtStrategy } from '../auth/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Post('profileUpload')
  @UseInterceptors(FileInterceptor('profile', multerConfig))
  async uploadProfile(@UploadedFile() file: Express.Multer.File) {
    const imagePath = `uploads/profiles/${file.filename}`;
    return { path: imagePath };
  }

  @Post('register')
  @UseGuards(JwtStrategy)
  async registerUser(@Request() req, @Body() body) {
    const uid = req.user.uid; // JWT 토큰에서 UID 추출
    const { name, profile_picture } = body;

    // 임시 저장된 사용자 정보를 가져오는 로직
    const tempUserData = await this.usersService.getTemporaryUser(uid);

    // 데이터베이스에 사용자 정보 저장
    await this.usersService.createOrUpdateUser({
      uid: uid,
      name: name,
      email: tempUserData.userData.email,
      profileImage: profile_picture,
    });

    return { success: true };
  }
}
