// users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private httpService: HttpService, // HttpService 주입
  ) {}

  async updateProfileWithKakaoToken(accessToken: string): Promise<User> {
    const kakaoProfile = await this.getKakaoProfile(accessToken);
    let user = await this.userRepository.findOne({
      where: { email: kakaoProfile.email },
    });
    if (!user) {
      user = this.userRepository.create({ email: kakaoProfile.email });
    }

    user.name = kakaoProfile.properties.nickname;
    user.profileImage = kakaoProfile.properties.profile_image;
    return this.userRepository.save(user);
  }

  private async getKakaoProfile(accessToken: string): Promise<any> {
    const kakaoProfileResponse = await this.httpService
      .get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .toPromise();
    return kakaoProfileResponse.data;
  }
}
