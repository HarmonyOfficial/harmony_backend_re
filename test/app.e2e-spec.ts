import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import {AuthModule} from "../src/auth/auth.module";
import {UserModule} from "../src/user/user.module";
import {RoomModule} from "../src/room/room.module";
import {ChatModule} from "../src/chat/chat.module";
import {CalendarModule} from "../src/calendar/calendar.module";
import {ExpenseModule} from "../src/expense/expense.module";
import {AuthService} from "../src/auth/auth.service";
import {UsersService} from "../src/user/user.service";
import {RoomService} from "../src/room/room.service";
import {ChatService} from "../src/chat/chat.service";
import {CalendarService} from "../src/calendar/calendar.service";
import {ExpenseService} from "../src/expense/expense.service";
import {AppService} from "../src/app.service";
import {AppController} from "../src/app.controller";
import {AuthController} from "../src/auth/auth.controller";
import {UserController} from "../src/user/user.controller";
import {RoomController} from "../src/room/room.controller";
import {ChatController} from "../src/chat/chat.controller";
import {ExpenseController} from "../src/expense/expense.controller";
import {JwtService} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../src/user/user.entity";
import {Room} from "../src/room/room.entity";
import {Task} from "../src/calendar/task.entity";
import {Message} from "../src/chat/message.entity";
import {Event} from "../src/calendar/event.entity";
import {Expense} from "../src/expense/expense.entity";
import {ChatGateway} from "../src/chat/chat.gateway";

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports:[TypeOrmModule.forFeature(
          [User,Room,Task,Message,Event,Expense]
      ),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            type: "mysql",
            host: "127.0.0.1",
            port: 3306, // Change the port value to a number
            username: "root",
            password: "hiamhm0707",
            database: "harmony2",
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
          }),
        }),
      ],
      providers: [AppService,AuthService,UsersService,RoomService,ChatService,CalendarService,ExpenseService,JwtService,ConfigService,ChatGateway],
      controllers: [AppController,AuthController,UserController,RoomController,ChatController,ExpenseController],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
