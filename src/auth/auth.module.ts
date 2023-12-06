import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemporaryUser } from './temporary-user.entity';

@Module({
  imports: [PassportModule, TypeOrmModule.forFeature([TemporaryUser])],
  providers: [UsersService],
})
export class AuthModule {}
