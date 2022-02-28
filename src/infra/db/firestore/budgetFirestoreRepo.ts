import { AddBudgetRepo } from "../../../data/interfaces/db/addBudgetRepo"
import { DeleteBudgetByIdRepo } from "../../../data/interfaces/db/deleteBudgetById"
import { GetBudgetByIdRepo } from "../../../data/interfaces/db/getBudgetById"
import { BudgetModel } from "../../../domain/models"
import { AddBudgetModel } from "../../../domain/useCases"
import { FirestoreHelper } from "./helpers/firestoreHelper"

export class BudgetFirestoreRepo implements AddBudgetRepo, GetBudgetByIdRepo, DeleteBudgetByIdRepo {
  async add (budgetData: AddBudgetModel): Promise<BudgetModel> {
    const budget = FirestoreHelper.getCollection('budgets').doc()
    const budgetObject = { id: budget.id, ...budgetData }

    await budget.set(budgetObject)
    
    return new Promise(resolve => resolve(budgetObject))
  }

  async getById(id: string): Promise<BudgetModel> {
    const budgetDoc = FirestoreHelper.getCollection('budgets').doc(id)
    const budget = (await budgetDoc.get()).data()
    if (budget) {
      return {
        id: budget.id,
        name: budget.name,
        total_realized: budget.total_realized,
        total_projected: budget.total_projected
      }
    }
    return null
  }

  async deleteById(id: string): Promise<string> {
    const budgetDoc = FirestoreHelper.getCollection('budgets').doc(id)
    const budget = (await budgetDoc.get()).data()
    if (budget) {
      await budgetDoc.delete()
      return budgetDoc.id
    }
    return null
  }
}
