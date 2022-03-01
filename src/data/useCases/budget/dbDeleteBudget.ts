import { DeleteBudget } from "../../../domain/useCases/deleteBudget"
import { DeleteBudgetByIdRepo } from "../../interfaces/db/budget/deleteBudgetByIdRepo"

export class DbDeleteBudget implements DeleteBudget {
  constructor (
    private readonly deleteBudgetRepository: DeleteBudgetByIdRepo
  ) {}

  async deleteById (id: string): Promise<string> {
    const budgetId = await this.deleteBudgetRepository.deleteById(id)
    return new Promise(resolve => resolve(budgetId))
  }
}