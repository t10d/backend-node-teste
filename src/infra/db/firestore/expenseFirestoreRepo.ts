import { DeleteExpenseByIdRepo } from "../../../data/interfaces/db/expense/deleteExpenseByIdRepo"
import { GetExpenseByIdRepo } from "../../../data/interfaces/db/expense/getExpenseByIdRepo"
import { GetExpensesByBudgetRepo } from "../../../data/interfaces/db/expense/getExpensesByBudgetRepo"
import { AddExpenseRepo } from "../../../data/useCases/expense/interfaces"
import { ExpenseModel } from "../../../domain/models"
import { AddExpenseModel } from "../../../domain/useCases"
import { FirestoreHelper } from "../../helpers/firestoreHelper"

export class ExpenseFirestoreRepo implements AddExpenseRepo, GetExpenseByIdRepo, DeleteExpenseByIdRepo, GetExpensesByBudgetRepo {
  async add (expenseData: AddExpenseModel): Promise<ExpenseModel> {
    const budgetRef = FirestoreHelper.getCollection('budgets').doc(expenseData.budgetId)

    if ((await budgetRef.get()).exists) {
      const expenseRef = budgetRef.collection('expenses').doc()
      const expenseObject = { id: expenseRef.id, ...expenseData }
      await expenseRef.set(expenseObject)
      
      return new Promise(resolve => resolve(expenseObject))
    }
    return null
  }

  async getById(id: string, budgetId: string): Promise<ExpenseModel> {
    const expenseDoc = FirestoreHelper.getCollection(`budgets/${budgetId}/expenses`).doc(id)
    const expense = (await expenseDoc.get()).data()
    if (expense) {
      return {
        id: expense.id,
        name: expense.name,
        category: expense.category,
        realized: expense.realized,
        projected: expense.projected,
        type: expense.type,
        budgetId: expense.budgetId
      }
    }
    return null
  }

  async deleteById(id: string, budgetId: string): Promise<string> {
    const expenseRef = FirestoreHelper.getCollection(`budgets/${budgetId}/expenses`).doc(id)
    const expense = (await expenseRef.get()).data()

    if (expense) {
      await expenseRef.delete()
      return expenseRef.id
    }
    return null
  }

  async getByBudget(id: string): Promise<ExpenseModel[]> {
    const expenseColRef = await FirestoreHelper.getCollection(`budgets/${id}/expenses`).listDocuments()

    if (expenseColRef) {
      const expensesPromise = expenseColRef.map(
        (async (expense: FirebaseFirestore.DocumentReference) => (await expense.get()).data())
      )
      return await Promise.all(expensesPromise) as ExpenseModel[]
    }
    return []
  }
}
