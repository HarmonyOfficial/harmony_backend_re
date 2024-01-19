import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post, Req, UploadedFile, UseGuards, UseInterceptors,
} from '@nestjs/common';
import {CalendarService} from "./calendar.service";
import {AccessGuard} from "../auth/access.guard";
import {FileInterceptor} from "@nestjs/platform-express";
import {multerConfig} from "../user/multer.config";

@Controller('calendar')
export class CalendarController {
  constructor(private calendarService: CalendarService) {}

  @Post('taskPost')
  @UseGuards(AccessGuard)
  async createTask(
    @Body() task, @Req() req) {
    const userId = req.user.id;
    return this.calendarService.createTask(userId,task);
  }

  @Post('eventPost')
  @UseGuards(AccessGuard)
  async createEvent(@Req() req,
      @Body() body ) {
    const userId = req.user.id;
    return this.calendarService.createEvent(userId,body);
  }

  @Get('tasks/:date')
  @UseGuards(AccessGuard)
  async getTasksByRoom(
      @Req()  req,
      @Param('date') date: string) {
    const userId = req.user.id;
    return this.calendarService.getTasks(userId,date);
  }

  @Get('events/:date')
  @UseGuards(AccessGuard)
  async getEventsByRoom(
      @Req() req,
      @Param('date') date: string) {
    const userId = req.user.id;
    return this.calendarService.getEvents(userId,date);
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
  @Post('task/complete/:taskId')
  @UseGuards(AccessGuard)
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async completeTask(
    @Param('taskId') taskId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imagePath = `uploads/completionImages/${file.filename}`;
    return this.calendarService.completeTask(taskId, imagePath);
  }
}
