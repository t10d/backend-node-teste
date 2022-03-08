import { BudgetModel, AddBudget, AddBudgetModel, AddBudgetRepo } from "./interfaces"

export class DbAddBudget implements AddBudget {
  constructor (
    private readonly addBudgetRepository: AddBudgetRepo
  ) {}

  async add (budgetData: AddBudgetModel): Promise<BudgetModel> {
    const budget = await this.addBudgetRepository.add(budgetData)
    return new Promise(resolve => resolve(budget))
  }
}
