import {
  Body,
  Controller,
  Get, Logger,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { JwtRefreshGuard } from './jwt-refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  private readonly logger = new Logger(AuthController.name);

  @Post('login')
  async login(@Body() body, @Res({ passthrough: true }) res: Response) {
    const { accessToken, vendor } = body;

    // AuthService를 사용하여 토큰과 사용자 정보를 검증하고 처리
    const result = await this.authService.login(accessToken, vendor);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    return {
      accessToken: result.accessToken, // 새로 생성된 JWT 액세스 토큰
      exists: result.userExists, // 사용자가 데이터베이스에 존재하는지 여부
    };
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refresh(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    const { refreshToken } = req.cookies;

    // JWT를 사용하여 토큰을 검증하고 처리
    const result = await this.authService.refresh(refreshToken);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    return {
      accessToken: result.accessToken, // 새로 생성된 JWT 액세스 토큰
    };
  }
}
