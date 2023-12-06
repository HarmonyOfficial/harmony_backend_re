import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [UsersService],
  controllers: [UserController],
  imports: [TypeOrmModule.forFeature([User]), HttpModule],
  exports: [TypeOrmModule],
})
export class UserModule {}
