// users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as fs from 'fs';
import * as path from 'path';

const IMAGES_DIR = path.join(__dirname, '../images');

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // 사용자 프로필 업데이트
  async updateProfile(userId: number, newName: string, base64Image: string) {
    // Base64 이미지를 파일로 변환하고 저장
    const imageBuffer = Buffer.from(base64Image, 'base64');
    const imagePath = path.join(IMAGES_DIR, `${userId}.png`);
    fs.writeFileSync(imagePath, imageBuffer);

    // 사용자 정보 업데이트
    await this.userRepository.update(userId, {
      name: newName,
      profileImage: imagePath,
    });
  }

  async saveProfileImage(userId: number, base64Image: string) {
    const imageBuffer = Buffer.from(base64Image, 'base64');
    const imagePath = path.join(IMAGES_DIR, `${userId}.png`);

    fs.writeFileSync(imagePath, imageBuffer);

    // 이미지 경로를 데이터베이스에 업데이트
    await this.userRepository.update(userId, { profileImage: imagePath });

    return imagePath;
  }

  // 기타 필요한 메서드들...
}
