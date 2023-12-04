import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

@Controller('calendar')
export class CalendarController {
  calendarService: any;
  // ... 생성자 ...

  @Post('task/create')
  async createTask(
    @Body()
    taskData: {
      date: Date;
      name: string;
      assignees: string[];
      repetition: number;
      roomId: number;
    },
  ) {
    return this.calendarService.createTask(taskData);
  }

  @Post('event/create')
  async createEvent(
    @Body()
    eventData: {
      date: Date;
      name: string;
      assignees: string[];
      roomId: number;
    },
  ) {
    return this.calendarService.createEvent(eventData);
  }

  @Get('tasks/room/:roomId')
  async getTasksByRoom(@Param('roomId') roomId: number) {
    return this.calendarService.getTasksByRoom(roomId);
  }

  @Get('events/room/:roomId')
  async getEventsByRoom(@Param('roomId') roomId: number) {
    return this.calendarService.getEventsByRoom(roomId);
  }

  @Patch('task/edit/:taskId')
  async editTask(@Param('taskId') taskId: number, @Body() updateData: any) {
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
