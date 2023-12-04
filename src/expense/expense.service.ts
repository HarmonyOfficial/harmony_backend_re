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
    // 사용자가 속한 방의 ID 목록을 가져옴
    const userRoomIds = await this.roomService.getUserRooms(userId);

    // 각 방의 총 소비 금액을 합산
    let totalExpense = 0;
    for (const roomId of userRoomIds) {
      const expenses = await this.expenseRepository.find({ where: { roomId } });
      const roomTotal = expenses.reduce(
        (total, expense) => total + expense.amount,
        0,
      );
      totalExpense += roomTotal;
    }

    return totalExpense;
  }
}
