import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Post('profile')
  async updateProfileWithKakaoToken(
    @Body() profileData: { accessToken: string },
  ) {
    const updatedUser = await this.usersService.updateProfileWithKakaoToken(
      profileData.accessToken,
    );
    return { message: 'Profile updated successfully', user: updatedUser };
  }
}
