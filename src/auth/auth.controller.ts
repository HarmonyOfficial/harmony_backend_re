import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body, @Res({ passthrough: true }) res: Response) {
    const { access_token, vendor } = body;

    // AuthService를 사용하여 토큰과 사용자 정보를 검증하고 처리
    const result = await this.authService.validateOAuthLogin(
      access_token,
      vendor,
    );

    res.cookie('refresh_token', result.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    return {
      access_token: result.access_token, // 새로 생성된 JWT 액세스 토큰
      exists: result.userExists, // 사용자가 데이터베이스에 존재하는지 여부
    };
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refresh(@Res({ passthrough: true }) res: Response) {
    const { refresh_token } = req.cookies;

    // JWT를 사용하여 토큰을 검증하고 처리
    const result = await this.authService.refresh(refresh_token);

    res.cookie('refresh_token', result.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    return {
      access_token: result.access_token, // 새로 생성된 JWT 액세스 토큰
    };
  }

}
