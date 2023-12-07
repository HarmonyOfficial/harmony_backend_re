import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import {ChatModule} from "./chat.module";
import {Task} from "../calendar/task.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Event} from "../calendar/event.entity";

describe('ChatService', () => {
  let service: ChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatService],
      imports: [ChatModule, TypeOrmModule.forFeature([Task,Event]),],
    }).compile();

    service = module.get<ChatService>(ChatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
