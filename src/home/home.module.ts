import { Module } from '@nestjs/common';
import {HomeController} from "./home.controller";
import {CalendarModule} from "../calendar/calendar.module";
import {ExpenseModule} from "../expense/expense.module";
import {RoomModule} from "../room/room.module";
import {CalendarService} from "../calendar/calendar.service";
import {ExpenseService} from "../expense/expense.service";
import {RoomService} from "../room/room.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Task} from "../calendar/task.entity";
import {Event} from "../calendar/event.entity";
import {ChatGateway} from "../chat/chat.gateway";
import {ChatModule} from "../chat/chat.module";

@Module(
    {
  imports: [CalendarModule, ExpenseModule, RoomModule, ChatModule,
    TypeOrmModule.forFeature([Task, Event])
  ],
        controllers: [HomeController],
    }
)
export class HomeModule {}
