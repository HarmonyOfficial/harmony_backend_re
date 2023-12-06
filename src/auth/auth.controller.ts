import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body) {
    const { access_token, vendor } = body;

    // AuthService를 사용하여 토큰과 사용자 정보를 검증하고 처리
    const result = await this.authService.validateOAuthLogin(
      access_token,
      vendor,
    );

    return {
      access_token: result.access_token, // 새로 생성된 JWT 액세스 토큰
      refresh_token: result.refresh_token, // 새로 생성된 JWT 리프레시 토큰
      exists: result.userExists, // 사용자가 데이터베이스에 존재하는지 여부
    };
  }
}
