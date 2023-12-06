import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequest } from './login.request';

@Controller('auth')
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  @Post('login')
  async login(@Body() loginRequest: LoginRequest) {
    return this.AuthService.login(loginRequest);
  }

  @Post('register')
  async register(
    @Body() registrationData: { name: string; profilePicture: string },
    @Req() req
  ) {
    await this.AuthService.registerUser(req.user.id, registrationData);
    return { success: true };
  }
}
