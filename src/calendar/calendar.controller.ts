import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post, Req, UseGuards,
} from '@nestjs/common';
import {CalendarService} from "./calendar.service";
import {AccessGuard} from "../auth/access.guard";

@Controller('calendar')
export class CalendarController {
  constructor(private calendarService: CalendarService) {}

  @Post('task')
  @UseGuards(AccessGuard)
  async createTask(
    @Body() task, @Req() req) {
    const userId = req.user.id;
    return this.calendarService.createTask(userId,task);
  }

  @Post('event')
  @UseGuards(AccessGuard)
  async createEvent(@Req() req,
      @Body() body ) {
    const userId = req.user.id;
    return this.calendarService.createEvent(userId,body);
  }

  @Get('tasks')
  @UseGuards(AccessGuard)
  async getTasksByRoom(
      @Req()  req,
      @Param('roomId') roomId: number) {
    const userId = req.user.id;
    return this.calendarService.getTasks(userId);
  }

  @Get('events')
  @UseGuards(AccessGuard)
  async getEventsByRoom(
      @Req() req,
      @Param('roomId') roomId: number) {
    const userId = req.user.id;
    return this.calendarService.getEvents(userId);
  }

  @Patch('task/edit/:taskId')
  async editTask(
      @Param('taskId') taskId: number, @Body() updateData: any) {
    return this.calendarService.editTask(taskId, updateData);
  }

  @Patch('event/edit/:eventId')
  async editEvent(@Param('eventId') eventId: number, @Body() updateData: any) {
    return this.calendarService.editEvent(eventId, updateData);
  }

  @Delete('task/delete/:taskId')
  async deleteTask(@Param('taskId') taskId: number) {
    await this.calendarService.deleteTask(taskId);
    return { message: 'Task deleted successfully' };
  }

  @Delete('event/delete/:eventId')
  async deleteEvent(@Param('eventId') eventId: number) {
    await this.calendarService.deleteEvent(eventId);
    return { message: 'Event deleted successfully' };
  }
  // 할일 완료
  @Patch('task/complete/:taskId')
  async completeTask(
    @Param('taskId') taskId: number,
    @Body() body: { completionImage: string },
  ) {
    return this.calendarService.completeTask(taskId, body.completionImage);
  }
}
