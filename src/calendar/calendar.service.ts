import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Event } from './event.entity';
import { Task } from './task.entity';
import { join } from 'path';
import { writeFile } from 'node:fs/promises';
import { ChatGateway } from '../chat/chat.gateway';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(Task)
    private TaskRepository: Repository<Task>,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    private chatGateway: ChatGateway, // ChatGateway 주입
  ) {}

  // 할일 생성
  async createTask(taskData: {
    date: Date;
    name: string;
    assignees: string[];
    repetition: number;
    roomId: number;
  }): Promise<Task> {
    const task = this.TaskRepository.create(taskData);
    return this.TaskRepository.save(task);
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

  // 일정 생성
  async createEvent(eventData: {
    date: Date;
    name: string;
    assignees: string[];
    roomId: number;
  }): Promise<Event> {
    const event = this.eventRepository.create(eventData as DeepPartial<Event>);
    return this.eventRepository.save(event);
  }

  // 할일 조회
  async getTasksByRoom(roomId: number): Promise<Task[]> {
    return this.TaskRepository.find({ where: { roomId } });
  }

  // 일정 조회
  async getEventsByRoom(roomId: number): Promise<Event[]> {
    return this.eventRepository.find({ where: { roomId } });
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
  // 할일 완료 처리
  async completeTask(
    taskId: number,
    completionImage: string,
    sender: string, // 'sender' 매개변수 추가
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

    // 할일 완료 메시지 전송
    const completionMessage = `${sender}님이 ${task.name}를 완료했어요! 이미지: ${completionImage}`;
    this.chatGateway.handleMessage({
      roomId: task.roomId.toString(),
      sender: sender,
      message: completionMessage,
    });

    return this.TaskRepository.save(task);
  }

  async getUserTasks(userId: number): Promise<Task[]> {
    const tasks = await this.TaskRepository.find();
    return tasks.filter((task) => task.assignees.includes(userId.toString()));
  }
}
