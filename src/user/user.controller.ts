// user.controller.ts
import { Controller, Param, Post, Body } from '@nestjs/common';
import { UsersService } from './user.service';

// user.controller.ts
@Controller('user')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Post('profile/:userId')
  async updateProfile(
    @Param('userId') userId: number,
    @Body() profileData: { name: string; image: string },
  ) {
    await this.usersService.updateProfile(
      userId,
      profileData.name,
      profileData.image,
    );
    return { message: 'Profile updated successfully' };
  }
}
