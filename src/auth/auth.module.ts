// auth.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtKakaoStrategy } from './jwt-kakao.strategy';
import { AuthService } from './auth.service';

@Module({
  imports: [PassportModule],
  providers: [JwtKakaoStrategy, AuthService],
})
export class AuthModule {}
