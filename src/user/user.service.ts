import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { compare, hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async userExists(uid: string) {
    const user = await this.userRepository.findOne({
      where: { uid },
    });
    return !!user;
  }

  async checkProfileComplete(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    return !!user.name && !!user.profileImage;
  }

  async updateUser(id: number, userData: any): Promise<User> {
    const user = await this.getUserById(id);

    user.name = userData.name;
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
    return this.userRepository.findOne({ where: { id }, relations: ['room','pendingRoom']});
  }

  async updateJoinDate(id: number) {
    const user = await this.getUserById(id);
    user.joinDate = new Date();
    return this.userRepository.save(user);
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

  // eslint-disable-next-line prettier/prettier
  async createUser(uid:string): Promise<User> {
    const user = { uid };
    return this.userRepository.save(user);
  }

  async getUserByUUID(uid: string): Promise<User> {
    return this.userRepository.findOne({ where: { uid } });
  }

  async getProfile(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }
}
