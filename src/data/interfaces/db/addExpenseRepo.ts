import { ExpenseModel } from "../../../domain/models"
import { AddExpenseModel } from "../../../domain/useCases"

export interface AddExpenseRepo {
  add (expenseData: AddExpenseModel): Promise<ExpenseModel>
}
