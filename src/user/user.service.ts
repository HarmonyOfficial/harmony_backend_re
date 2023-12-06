import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async checkUserExists(userId: string) {
    // 유저가 존재하는지 확인
    const user = await this.userRepository.findOne({
      where: { uid: userId },
    });
  }

  async saveProfile(userId: string, name: string, profileImage: string) {
    // 유저 정보 저장
    const user = await this.userRepository.findOne({
      where: { uid: userId },
    });
    if (user) {
      user.name = name;
      user.profileImage = profileImage;
      await this.userRepository.save(user);
    } else {
      await this.userRepository.save({
        uid: userId,
        name,
        profileImage,
      });
    }
  }
}
