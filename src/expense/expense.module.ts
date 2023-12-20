import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from './expense.entity';
import { RoomModule } from '../room/room.module';
import {UsersService} from "../user/user.service";
import {UserModule} from "../user/user.module";

@Module({
  providers: [ExpenseService,UsersService],
  controllers: [ExpenseController],
  imports: [TypeOrmModule.forFeature([Expense]), RoomModule, UserModule],
  exports: [ExpenseService],
})
export class ExpenseModule {}
