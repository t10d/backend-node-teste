import { ExpenseModel, AddExpense, AddExpenseModel, AddExpenseRepo } from "./interfaces"

export class DbAddExpense implements AddExpense {
  constructor (
    private readonly addExpenseRepository: AddExpenseRepo
  ) {}

  async add (expenseData: AddExpenseModel): Promise<ExpenseModel> {
    const expense = await this.addExpenseRepository.add(expenseData)
    return new Promise(resolve => resolve(expense))
  }
}
