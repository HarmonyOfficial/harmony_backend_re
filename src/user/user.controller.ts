import { Controller, Post, UseInterceptors, UploadedFile, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from './multer.config';
import { UsersService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Post('profileUpload')
  @UseInterceptors(FileInterceptor('profile', multerConfig))
  async uploadProfile(@UploadedFile() file: Express.Multer.File) {
    const imagePath = `uploads/profiles/${file.filename}`;
    return { path: imagePath };
  }
}
