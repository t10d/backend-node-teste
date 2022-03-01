import { BudgetModel } from "../models/budgetModel"

export interface AddBudgetModel {
  name: string
  totalRealized: number
  totalProjected: number
  userId: string
}
export interface AddBudget {
  add (budget: AddBudgetModel): Promise<BudgetModel>
}
