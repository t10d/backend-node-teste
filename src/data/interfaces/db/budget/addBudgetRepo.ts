import { BudgetModel } from "../../../../domain/models"
import { AddBudgetModel } from "../../../../domain/useCases"

export interface AddBudgetRepo {
  add (budgetData: AddBudgetModel): Promise<BudgetModel>
}
