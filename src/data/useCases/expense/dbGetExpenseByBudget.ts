import { GetExpensesByBudget } from "../../../domain/useCases/GetExpensesByBudget"
import { GetExpensesByBudgetRepo } from "../../interfaces/db/expense/getExpensesByBudgetRepo"
import { ExpenseModel } from "./interfaces"

export class DbGetExpensesByBudget implements GetExpensesByBudget {
  constructor (
    private readonly getExpenseByBudgetRepository: GetExpensesByBudgetRepo
  ) {}

  async getByBudget (id: string): Promise<ExpenseModel[]> {
    const expenses = await this.getExpenseByBudgetRepository.getByBudget(id)
    return new Promise(resolve => resolve(expenses))
  }
}