import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Event } from './event.entity';
import { Task } from './task.entity';
import { join } from 'path';
import { writeFile } from 'node:fs/promises';
import { ChatGateway } from '../chat/chat.gateway';
import {RoomService} from "../room/room.service";
import {UsersService} from "../user/user.service";

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(Task)
    private TaskRepository: Repository<Task>,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    private chatGateway: ChatGateway, // ChatGateway 주입
    private roomService: RoomService, // RoomService 주입
    private userService: UsersService, // UserService 주입
  ) {}

  // 할일 생성
  async createTask(userId:number, taskData:any): Promise<Task> {
    const room = await this.roomService.getUserRoom(userId);

    const attendeesIds = taskData.attendees || []; // attendees가 없는 경우 빈 배열 처리

    const attendees = await Promise.all(attendeesIds.map((attendeeId: number) => this.userService.getUserById(attendeeId)));

    const task = this.TaskRepository.create({
      name: taskData.name,
      date: taskData.date,
      repetition: taskData.repeatCount,
      room,
      attendees, // 담당자들을 할일의 attendees에 할당
    });
    taskData.attendees.forEach((attendee:number) => {
      const user = this.userService.getUserById(attendee).then(
        (user) => {
          task.attendees.push(user);
        }
      )
    });
    return this.TaskRepository.save(task);
  }

  async createEvent(userId: number, eventData: any): Promise<Event> {
    const room = await this.roomService.getUserRoom(userId);

    const attendeesIds = eventData.attendees || []; // attendees가 없는 경우 빈 배열 처리

    const attendees = await Promise.all(attendeesIds.map((attendeeId: number) => this.userService.getUserById(attendeeId)));

    const event = this.eventRepository.create({
      name: eventData.name,
      date: eventData.date,
      room,
      attendees, // 담당자들을 이벤트의 attendees에 할당
    });

    return this.eventRepository.save(event);
  }

  private async saveCompletionImage(
    imageBase64: string,
    taskId: number,
  ): Promise<string> {
    const imagePath = join(__dirname, `../../uploads/tasks/${taskId}.png`);
    const imageBuffer = Buffer.from(imageBase64, 'base64');
    await writeFile(imagePath, imageBuffer);
    return imagePath;
  }

  async getTasks(userId: number): Promise<Task[]> {
    const room = await this.roomService.getUserRoom(userId);
    return this.TaskRepository.find({
      where: { room: {
        id: room.id,
        } }, relations: ['attendees'],
    });
  }

  async getEvents(userId: number): Promise<Event[]> {
    const room = await this.roomService.getUserRoom(userId);
    return await this.eventRepository.find({
      where: { room: {
          id: room.id,
        } }, relations: ['attendees'],
    });
  }

  // 할일 편집
  async editTask(taskId: number, updateData: any): Promise<Task> {
    await this.TaskRepository.update(taskId, updateData);
    return this.TaskRepository.findOne({ where: { id: taskId } });
  }

  // 일정 편집
  async editEvent(eventId: number, updateData: any): Promise<Event> {
    await this.eventRepository.update(eventId, updateData);
    return this.eventRepository.findOne({ where: { id: eventId } });
  }

  // 할일 삭제
  async deleteTask(taskId: number): Promise<void> {
    await this.TaskRepository.delete(taskId);
  }

  // 일정 삭제
  async deleteEvent(eventId: number): Promise<void> {
    await this.eventRepository.delete(eventId);
  }
  async completeTask(
    taskId: number,
    completionImage: string,
  ): Promise<Task> {
    // 할일 완료 메시지 전송
    const task = await this.TaskRepository.findOne({ where: { id: taskId } });
    if (!task) {
      throw new Error('Task not found');
    }
    const imagePath = await this.saveCompletionImage(completionImage, taskId);
    task.completionImage = imagePath;
    await this.TaskRepository.save(task);

    // 할일 완료 처리
    task.completed = true;
    task.completionImage = completionImage;

    return this.TaskRepository.save(task);
  }
}
