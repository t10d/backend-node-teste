import { ExpenseModel } from "../../../../domain/models";

export interface GetExpenseByIdRepo {
  getById (id: string, budgetId: string): Promise<ExpenseModel> 
}