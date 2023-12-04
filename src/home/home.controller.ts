import { Controller, Get, Param } from '@nestjs/common';
import { RoomService } from '../room/room.service';
import { CalendarService } from 'src/calendar/calendar.service';
import { ExpenseService } from 'src/expense/expense.service';

@Controller('home')
export class HomeController {
  constructor(
    private calendarService: CalendarService,
    private expenseService: ExpenseService,
    private roomService: RoomService, // Fixed the variable name to 'roomService'
  ) {}

  @Get(':uid')
  async getHomeData(@Param('uid') uid: number) {
    const tasks = await this.calendarService.getUserTasks(uid);
    const totalExpense = await this.expenseService.getMonthlyTotal(uid);
    const groupMembers = await this.roomService.getUserRooms(uid); // Fixed the variable name to 'roomService'

    return {
      tasks,
      totalExpense,
      groupMembers,
    };
  }
}
