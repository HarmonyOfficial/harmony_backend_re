// auth.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtKakaoStrategy } from './jwt-kakao.strategy';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PassportModule,
    UserModule,
    JwtModule.register({
      secret: 'secret', // 실제 애플리케이션에서는 보안을 위해 환경변수 등을 사용
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [JwtKakaoStrategy, AuthService],
})
export class AuthModule {}
