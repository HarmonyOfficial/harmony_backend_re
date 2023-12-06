import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemporaryUser } from './temporary-user.entity';
import {JwtRefreshStrategy} from "./jwt-refresh.strategy";
import {JwtStrategy} from "./jwt.strategy";
import {AuthController} from "./auth.controller";
import {UserModule} from "../user/user.module";

@Module({
  imports: [PassportModule, TypeOrmModule.forFeature([TemporaryUser]),UserModule],
  providers: [JwtRefreshStrategy,JwtStrategy,UsersService],
  controllers: [AuthController],

})
export class AuthModule {}
