import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { RoomModule } from './room/room.module';
import { ExpenseModule } from './expense/expense.module';
import { CalendarService } from './calendar/calendar.service';
import { CalendarController } from './calendar/calendar.controller';
import { CalendarModule } from './calendar/calendar.module';
import { ChatService } from './chat/chat.service';
import { ChatController } from './chat/chat.controller';
import { UsersService } from './user/user.service';
@Module({
  imports: [
    AuthModule,
    UserModule,
    RoomModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DATABASE_HOST'),
        port: +configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // 개발 환경에서만 사용
      }),
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
    ExpenseModule,
    CalendarModule,
  ],
  controllers: [AppController, CalendarController, ChatController],
  providers: [AppService, CalendarService, ChatService, UsersService],
})
export class AppModule {}
