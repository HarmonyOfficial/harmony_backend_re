import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { HttpService } from '@nestjs/axios';

@Module({
  providers: [UsersService],
  controllers: [UserController],
  imports: [TypeOrmModule.forFeature([User]), HttpService],
  exports: [TypeOrmModule],
})
export class UserModule {}
