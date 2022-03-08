import { ExpenseModel } from "../models/expenseModel"

export interface UpdateExpenseModel {
  id: string
  budgetId: string
  name?: string
  category?: string
  realized?: number
  projected?: number
  type?: string
}

export interface UpdateExpense {
  update (expense: UpdateExpenseModel): Promise<ExpenseModel>
}
