import { ExpenseModel } from "../models";

export interface GetExpensesByBudget {
  get (id: string): Promise<ExpenseModel[]>
}
