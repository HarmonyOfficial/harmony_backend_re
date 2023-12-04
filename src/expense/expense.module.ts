import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from './expense.entity';
import { RoomModule } from '../room/room.module';

@Module({
  providers: [ExpenseService],
  controllers: [ExpenseController],
  imports: [TypeOrmModule.forFeature([Expense]), RoomModule],
})
export class ExpenseModule {}
