// auth.controller.ts
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/user/user.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLogin() {
    // 카카오 로그인을 시작합니다.
  }

  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoCallback(@Req() req, @Res() res) {
    const kakaoUser = req.user;

    // 사용자 정보 업데이트
    await this.usersService.updateProfile(
      kakaoUser.userId,
      kakaoUser.name,
      kakaoUser.profileImage,
    );

    // JWT 토큰 생성
    const token = await this.authService.createToken(kakaoUser);

    // 클라이언트에 토큰과 사용자 정보 전달
    return res.json({
      message: 'Login successful',
      user: kakaoUser,
      token: token,
    });
  }
}
