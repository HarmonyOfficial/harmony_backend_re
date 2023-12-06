import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import {ConfigService} from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(token: string, vendor: string): Promise<any> {
    if (!token || !vendor) {
      throw new BadRequestException('Access token or vendor is missing');
    }

    const userProfile = await this.getExternalUserData(token, vendor);

    const userExists = await this.userService.userExists(userProfile.uid);
    if (!userExists) {
      await this.userService.createUser(userProfile.uid);
    }

    const user = await this.userService.getUserByUUID(userProfile.uid);

    const payload = { id: user.id };
    const accessToken = this.jwtService.sign(payload,{
      secret: this.configService.get('ACCESS_TOKEN_SECRET'),
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      expiresIn: '7d',
    });

    await this.userService.setCurrentRefreshToken(refreshToken, userProfile.id)

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      profileComplete: this.userService.checkProfileComplete(user.id),
    };
  }

  private async getExternalUserData(
    accessToken: string,
    vendor: string,
  ): Promise<any> {
    switch (vendor) {
      case 'kakao':
        return this.getKakaoUserData(accessToken);
      case 'google':
        return this.getGoogleUserData(accessToken);
      case 'apple':
        return this.getAppleUserData(accessToken);
      default:
        throw new Error('Not supported vendor');
    }
  }

  async refresh(refreshToken: string): Promise<any> {
    const { id } = this.jwtService.verify(refreshToken, {
      secret: process.env.REFRESH_TOKEN_SECRET,
    });

    const user = await this.userService.getUserById(id);

    if (!user) {
      throw new BadRequestException('Invalid refresh token');
    }

    const payload = { id: user.id };
    const access_token = this.jwtService.sign(payload,{
      secret: this.configService.get('ACCESS_TOKEN_SECRET'),
    });
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      expiresIn: '7d',
    });

    await this.userService.setCurrentRefreshToken(refresh_token, user.id)

    return {
      accessToken: access_token,
      refreshToken: refresh_token,
    };
  }

  async getKakaoUserData(accessToken: string): Promise<any> {
    const { data } = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const {
      id,
    } = data;
    return {
      uid: `kakao:${id}`,
    };
  }

  async getGoogleUserData(accessToken: string): Promise<any> {
    const { data } = await axios.get(
      'https://www.googleapis.com/oauth2/v1/userinfo?alt=json',
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    const { id, name, picture } = data;
    return { uid: `google:${id}`, name, profileImage: picture };
  }

  async getAppleUserData(accessToken: string): Promise<any> {
    // Apple ID 토큰을 디코딩합니다. 실제로는 ID 토큰을 받아야 합니다.
    const decoded = jwt.decode(accessToken);

    if (!decoded || typeof decoded === 'string') {
      throw new InternalServerErrorException('Invalid Apple ID token');
    }

    // 여기에서 Apple의 사용자 정보를 추출합니다.
    return {
      uid: decoded.sub,
      name: decoded.name,
      profileImage: decoded.picture,
    };
  }
}
