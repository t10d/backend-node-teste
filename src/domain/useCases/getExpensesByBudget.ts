import { ExpenseModel } from "../models";

export interface GetExpensesByBudget {
  getByBudget (id: string): Promise<ExpenseModel[]>
}
