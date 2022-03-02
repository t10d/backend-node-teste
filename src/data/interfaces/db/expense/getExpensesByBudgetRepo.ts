import { ExpenseModel } from "../../../../domain/models";

export interface GetExpensesByBudgetRepo {
  getByBudget (id: string, userId: string): Promise<ExpenseModel[]> 
}