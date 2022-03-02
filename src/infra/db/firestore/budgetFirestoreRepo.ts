import { AddBudgetRepo } from "../../../data/interfaces/db/budget/addBudgetRepo"
import { DeleteBudgetByIdRepo } from "../../../data/interfaces/db/budget/deleteBudgetByIdRepo"
import { GetBudgetByIdRepo } from "../../../data/interfaces/db/budget/getBudgetByIdRepo"
import { BudgetModel, ExpenseModel } from "../../../domain/models"
import { AddBudgetModel } from "../../../domain/useCases"
import { FirestoreHelper } from "../../helpers/firestoreHelper"

export class BudgetFirestoreRepo implements AddBudgetRepo, GetBudgetByIdRepo, DeleteBudgetByIdRepo {
  async add (budgetData: AddBudgetModel): Promise<BudgetModel> {
    const budget = FirestoreHelper.getCollection('budgets').doc()
    const budgetObject = { id: budget.id, ...budgetData }

    await budget.set(budgetObject)
    
    return new Promise(resolve => resolve(budgetObject))
  }

  async getById(id: string): Promise<BudgetModel> {
    const budgetRef = FirestoreHelper.getCollection('budgets').doc(id)
    const budgetSnap = (await budgetRef.get())
    if (budgetSnap.exists) {
      const expenseColRef = await budgetRef.collection('expenses').listDocuments()
      if (expenseColRef) {
        const expensesPromise = expenseColRef.map(
          (async (expense: FirebaseFirestore.DocumentReference) => (await expense.get()).data())
        )
        const budget = budgetSnap.data() as BudgetModel
        budget.expenses = await Promise.all(expensesPromise) as ExpenseModel[]
        return budget
      }
    }
    return null
  }

  async deleteById(id: string): Promise<string> {
    const budgetDoc = FirestoreHelper.getCollection('budgets').doc(id)
    const budget = (await budgetDoc.get()).data()
    if (budget) {
      // TODO: test for this
      if (budget.expenses) {
        for (const expense of budget.expenses) await expense.delete()
      }
      await budgetDoc.delete()
      return budgetDoc.id
    }
    return null
  }
}
