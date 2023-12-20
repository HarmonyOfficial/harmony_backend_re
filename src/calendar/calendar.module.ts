import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Event } from './event.entity';
import { CalendarService } from './calendar.service';
import { CalendarController } from './calendar.controller';
import { ChatModule } from '../chat/chat.module';
import {RoomModule} from "../room/room.module";
import {UserModule} from "../user/user.module";
import {UsersService} from "../user/user.service"; // ChatModule 임포트

@Module({
  imports: [TypeOrmModule.forFeature([Task, Event]), ChatModule,RoomModule,UserModule],
  providers: [CalendarService,UsersService],
  controllers: [CalendarController],
  exports: [CalendarService],
})
export class CalendarModule {}
