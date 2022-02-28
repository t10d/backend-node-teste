import { BudgetModel } from "../models/budgetModel"

export interface AddBudgetModel {
  name: string
  total_realized: number
  total_projected: number
}

export interface AddBudget {
  add (budget: AddBudgetModel): Promise<BudgetModel>
}
