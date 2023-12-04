import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarService } from './calendar.service';
import { CalendarController } from './calendar.controller';
import { Task } from './task.entity';
import { Event } from './event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Event])],
  providers: [CalendarService],
  controllers: [CalendarController],
})
export class CalendarModule {}
