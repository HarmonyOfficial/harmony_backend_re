import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { UsersService } from '../user/user.service';
import { LoginRequest } from './login.request';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(data: LoginRequest) {
    let userId;
    switch (data.vendor) {
      case 'kakao': {
        const kakaoUserInfo = await this.getKakaoUserInfo(data.accessToken);
        userId = kakaoUserInfo.id;
        break;
      }
      default:
        throw new Error('Invalid vendor');
    }

    const accessToken = await this.generateAccessToken(userId);
    const refreshToken = await this.generateRefreshToken(userId);
    
    const userExists = await this.userService.checkUserExists(userId);

    return {
      accessToken,
      refreshToken,
      exists: userExists,
    };
  }

  private async getKakaoUserInfo(accessToken: string) {
    const response = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  }

  private async generateAccessToken(userId: string) {
    // Access token 생성
    const payload = { userId };
    return this.jwtService.sign(payload);
  }

  private async generateRefreshToken(userId: string) {
    // Refresh token 생성
    const payload = { userId };
    return this.jwtService.sign(payload, { expiresIn: '30d' });
  }

  async registerUser(userId: string, registrationData: { name: string; profilePicture: string }) {
    await this.userService.saveProfile(userId, registrationData.name, registrationData.profilePicture);
    return { success: true };
  }
}
