import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { TemporaryUser } from '../auth/temporary-user.entity';
import {compare, hash} from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(TemporaryUser)
    private temporaryUserRepository: Repository<TemporaryUser>, // 임시 사용자 리포지토리 추가
  ) {}

  async userExists(uid: string) {
    const user = await this.userRepository.findOne({
      where: { uid },
    });
    return !!user;
  }

  async getTemporaryUser(uid: string): Promise<TemporaryUser> {
    return this.temporaryUserRepository.findOne({ where: { uid } });
  }

  async createOrUpdateUser(userData: any): Promise<User> {
    let user = await this.userRepository.findOne({
      where: { uid: userData.uid },
    });

    if (!user) {
      user = new User();
      user.uid = userData.uid;
    }
    user.name = userData.name;
    user.email = userData.email;
    user.profileImage = userData.profileImage;

    return this.userRepository.save(user);
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, id: number) {
    const user = await this.getUserById(id);

    const isRefreshTokenMatching = await compare(
        refreshToken,
        user.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async getUserById(id: number) {
    return this.userRepository.findOne({where: {id}});
  }

  async removeRefreshToken(id: number) {
    return this.userRepository.update(id, {
      currentHashedRefreshToken: null,
    });
  }

  async setCurrentRefreshToken(refreshToken: string, id: number) {
    const currentHashedRefreshToken = await hash(refreshToken, 10);
    await this.userRepository.update(id, { currentHashedRefreshToken });
  }

}
