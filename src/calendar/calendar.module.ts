import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Event } from './event.entity';
import { CalendarService } from './calendar.service';
import { CalendarController } from './calendar.controller';
import { ChatModule } from '../chat/chat.module'; // ChatModule 임포트

@Module({
  imports: [TypeOrmModule.forFeature([Task, Event]), ChatModule],
  providers: [CalendarService],
  controllers: [CalendarController],
})
export class CalendarModule {}
