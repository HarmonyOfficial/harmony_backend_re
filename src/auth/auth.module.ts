import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from '../user/user.service';
import { JwtRefreshStrategy } from './jwt-refresh.strategy';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [PassportModule, UserModule],
  providers: [
    JwtRefreshStrategy,
    JwtStrategy,
    UsersService,
    AuthService,
    JwtService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
