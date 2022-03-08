import { ExpenseModel, UpdateExpense, UpdateExpenseModel, UpdateExpenseRepo } from "./interfaces"

export class DbUpdateExpense implements UpdateExpense {
  constructor (
    private readonly updateExpenseRepository: UpdateExpenseRepo
  ) {}

  async update (expenseData: UpdateExpenseModel): Promise<ExpenseModel> {
    const expense = await this.updateExpenseRepository.update(expenseData)
    return new Promise(resolve => resolve(expense))
  }
}