import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';

@Injectable()
export class JwtKakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      callbackURL: process.env.KAKAO_CALLBACK_URL,
    });
  }

  async validate(accessToken, refreshToken, profile, done) {
    try {
      // Find the user by Kakao ID
      let user = await this.userRepository.findOne({
        where: { uid: profile.id },
      });

      if (!user) {
        // User not found, create a new user
        const newUser = this.userRepository.create({
          uid: profile.id,
          name: profile.displayName,
          email: profile._json && profile._json.kakao_account.email,
          // Additional user fields as needed
        });

        user = await this.userRepository.save(newUser);
      }

      // Return user and accessToken
      return done(null, { user, accessToken });
    } catch (error) {
      // Handle errors
      return done(error, false);
    }
  }
}
