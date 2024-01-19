import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { RoomService } from '../room/room.service';
import { CalendarService } from 'src/calendar/calendar.service';
import { ExpenseService } from 'src/expense/expense.service';
import { AccessGuard } from 'src/auth/access.guard';

@Controller('home')
export class HomeController {
  constructor(
    private calendarService: CalendarService,
    private expenseService: ExpenseService,
    private roomService: RoomService, // Fixed the variable name to 'roomService'
  ) {}

  @Get('info')
  @UseGuards(AccessGuard)
  async getUserRooms(@Request() req) {
    const userId = req.user.id; // JWT 토큰에서 userId 추출
    const tasks = await this.calendarService.getTasks(userId, new Date().toLocaleDateString());
    const events = await this.calendarService.getEvents(userId,new Date().toLocaleDateString())
    const totalExpense = await this.expenseService.getMonthlyTotal(userId);
    const groupMembers = await this.roomService.getRoomMembers(userId); // Fixed the variable name to 'roomService'
    const pendingInvitations = await this.roomService.getPendingInvitations(userId); // Fixed the variable name to 'roomService'

    return {
      tasks,
      totalExpense,
      groupMembers,
      events,
      pendingInvitations,
    };
  }
}
