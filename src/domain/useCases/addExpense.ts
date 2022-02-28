import { ExpenseModel } from "../models/expenseModel"

export interface AddExpenseModel {
  name: string
  category: string
  realized: number
  projected: number
  type: string
  budgetId: string
}

export interface AddExpense {
  add (expense: AddExpenseModel): Promise<ExpenseModel>
}
