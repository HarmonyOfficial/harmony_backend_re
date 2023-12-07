import { Injectable } from '@nestjs/common';
import { Expense } from './expense.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomService } from '../room/room.service';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,
    private roomService: RoomService, // RoomService 주입
  ) {}

  async createExpense(
    roomId: number,
    expenseData: {
      name: string;
      category: string;
      date: Date;
      person: string;
      amount: number;
    },
  ): Promise<Expense> {
    const expense = this.expenseRepository.create({ ...expenseData, roomId });
    return this.expenseRepository.save(expense);
  }

  async getExpensesByRoom(roomId: number): Promise<Expense[]> {
    return this.expenseRepository.find({ where: { roomId } });
  }

  async editExpense(
    expenseId: number,
    updateData: {
      name?: string;
      category?: string;
      date?: Date;
      person?: string;
      amount?: number;
    },
  ): Promise<Expense> {
    const expense = await this.expenseRepository.findOne({
      where: { id: expenseId },
    });
    if (!expense) {
      throw new Error('Expense not found');
    }
    Object.assign(expense, updateData);
    return this.expenseRepository.save(expense);
  }

  async deleteExpense(expenseId: number): Promise<void> {
    await this.expenseRepository.delete(expenseId);
  }

  async getMonthlyTotal(userId: number): Promise<number> {
    // 사용자가 속한 방의 ID를 가져옴
    const userRoom = await this.roomService.getUserRoom(userId);
    // 해당 방의 지출 목록을 가져옴
    const expenses = await this.expenseRepository.find({
      where: { roomId: userRoom.id },
    });
    // 월별 지출 총액을 계산
    const monthlyTotal = expenses.reduce((acc, expense) => {
      const expenseDate = new Date(expense.date);
      const today = new Date();
      if (
          expenseDate.getFullYear() === today.getFullYear() &&
          expenseDate.getMonth() === today.getMonth()
      ) {
        return acc + expense.amount;
      }
      return acc;
    }, 0);
    // 총액을 반환
    return monthlyTotal;
  }
}
