import { ExpenseModel } from ".";

export interface BudgetModel {
  id: string
  name: string
  totalRealized: number
  totalProjected: number
  expenses?: ExpenseModel[]
}
