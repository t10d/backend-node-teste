import { ExpenseModel } from "../models";

export interface GetExpensesByBudget {
  getByBudget (id: string, userId: string): Promise<ExpenseModel[]>
}
