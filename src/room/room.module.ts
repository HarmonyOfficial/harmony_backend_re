import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './room.entity';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import {UserModule} from "../user/user.module";
import {UsersService} from "../user/user.service";

@Module({
  imports: [TypeOrmModule.forFeature([Room]),UserModule],
  providers: [RoomService,UsersService],
  controllers: [RoomController],
  exports: [RoomService], // RoomService를 다른 모듈에서 사용할 수 있도록 추가
})
export class RoomModule {}
