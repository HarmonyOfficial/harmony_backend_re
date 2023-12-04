import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

@Controller('expense')
export class ExpenseController {
  expenseService: any;
  // ... 생성자 ...

  @Post('create')
  async createExpense(
    @Body()
    expenseData: {
      roomId: number;
      name: string;
      category: string;
      date: Date;
      person: string;
      amount: number;
    },
  ) {
    return this.expenseService.createExpense(expenseData.roomId, expenseData);
  }

  @Get('room/:roomId')
  async getExpensesByRoom(@Param('roomId') roomId: number) {
    return this.expenseService.getExpensesByRoom(roomId);
  }

  @Patch('edit/:expenseId')
  async editExpense(
    @Param('expenseId') expenseId: number,
    @Body()
    updateData: {
      name?: string;
      category?: string;
      date?: Date;
      person?: string;
      amount?: number;
    },
  ) {
    return this.expenseService.editExpense(expenseId, updateData);
  }

  @Delete('delete/:expenseId')
  async deleteExpense(@Param('expenseId') expenseId: number) {
    await this.expenseService.deleteExpense(expenseId);
    return { message: 'Expense deleted successfully' };
  }
}
