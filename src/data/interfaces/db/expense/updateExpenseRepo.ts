import { ExpenseModel } from "../../../../domain/models"
import { UpdateExpenseModel } from "../../../../domain/useCases"

export interface UpdateExpenseRepo {
  update (expenseData: UpdateExpenseModel): Promise<ExpenseModel>
}
