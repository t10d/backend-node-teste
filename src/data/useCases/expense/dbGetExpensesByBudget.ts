import { GetExpensesByBudget } from "../../../domain/useCases/GetExpensesByBudget"
import { GetExpensesByBudgetRepo } from "../../interfaces/db/expense/getExpensesByBudgetRepo"
import { ExpenseModel } from "./interfaces"

export class DbGetExpensesByBudget implements GetExpensesByBudget {
  constructor (
    private readonly getExpenseByBudgetRepository: GetExpensesByBudgetRepo
  ) {}

  async getByBudget (id: string, userId: string): Promise<ExpenseModel[]> {
    const expenses = await this.getExpenseByBudgetRepository.getByBudget(id, userId)
    return new Promise(resolve => resolve(expenses))
  }
}