import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { TemporaryUser } from './temporary-user.entity';
import { Repository } from 'typeorm';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import {ConfigService} from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(TemporaryUser)
    private temporaryUserRepository: Repository<TemporaryUser>,
    private userService: UsersService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,

  ) {}

  async validateOAuthLogin(accessToken: string, vendor: string): Promise<any> {
    if (!accessToken || !vendor) {
      throw new BadRequestException('Access token or vendor is missing');
    }

    let userProfile;
    try {
      userProfile = await this.getExternalUserData(accessToken, vendor);
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch user data');
    }

    const userExists = await this.userService.userExists(userProfile.uid);
    if (!userExists) {
      await this.createOrUpdateTemporaryUser(userProfile.uid, userProfile);
    }

    const payload = { id: userProfile.user_uuid, username: userProfile.name };
    const access_token = this.jwtService.sign(payload,{
      secret: this.configService.get('ACCESS_TOKEN_SECRET'),
    });
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      expiresIn: '7d',
    });
    return {
      accessToken: access_token,
      refreshToken: refresh_token,
      userExists,
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

    const payload = { id: user.id, username: user.name };
    const access_token = this.jwtService.sign(payload,{
      secret: this.configService.get('ACCESS_TOKEN_SECRET'),
    });
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      expiresIn: '7d',
    });
    return {
      accessToken: access_token,
      refreshToken: refresh_token,
    };
  }

  async createOrUpdateTemporaryUser(
    uid: string,
    userData: any,
  ): Promise<TemporaryUser> {
    let tempUser = await this.temporaryUserRepository.findOne({
      where: { uid },
    });

    if (tempUser) {
      tempUser.userData = userData;
    } else {
      tempUser = this.temporaryUserRepository.create({ uid, userData });
    }

    return this.temporaryUserRepository.save(tempUser);
  }

  async getTemporaryUser(uid: string): Promise<TemporaryUser> {
    return this.temporaryUserRepository.findOne({ where: { uid } });
  }

  async getKakaoUserData(accessToken: string): Promise<any> {
    const { data } = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const {
      id,
      kakao_account: { profile },
    } = data;
    return {
      uid: `kakao:${id}`,
      name: profile.nickname,
      profileImage: profile.profile_image_url,
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
