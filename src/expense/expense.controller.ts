import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post, Request, UseGuards
} from '@nestjs/common';
import {ExpenseService} from "./expense.service";
import {AccessGuard} from "../auth/access.guard";

@Controller('expense')
export class ExpenseController {
  constructor(private expenseService: ExpenseService) {}

  @Post('')
  @UseGuards(AccessGuard)
  async createExpense(
      @Request() req,
    @Body()
    expenseData: {
      name: string;
      category: number;
      amount: number;
    },
  ) {
    const userId = req.user.id;
    return this.expenseService.createExpense(userId, expenseData);
  }

  @Get()
  @UseGuards(AccessGuard)
  async getExpensesByRoom(@Request() req) {
    return this.expenseService.getExpenses(req.user.id);
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

  @Delete(':expenseId')
  async deleteExpense(@Param('expenseId') expenseId: number) {
    await this.expenseService.deleteExpense(expenseId);
    return { message: 'Expense deleted successfully' };
  }

  @Get(':expenseId')
  async getExpense(@Param('expenseId') expenseId: number) {
    return this.expenseService.getExpense(expenseId);
  }
}
