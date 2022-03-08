import { DeleteExpenseByIdRepo } from "../../../data/interfaces/db/expense/deleteExpenseByIdRepo"
import { GetExpenseByIdRepo } from "../../../data/interfaces/db/expense/getExpenseByIdRepo"
import { GetExpensesByBudgetRepo } from "../../../data/interfaces/db/expense/getExpensesByBudgetRepo"
import { AddExpenseRepo, UpdateExpenseRepo } from "../../../data/useCases/expense/interfaces"
import { ExpenseModel } from "../../../domain/models"
import { AddExpenseModel, UpdateExpenseModel } from "../../../domain/useCases"
import { FirestoreHelper } from "../../helpers/firestoreHelper"

export class ExpenseFirestoreRepo implements AddExpenseRepo, GetExpenseByIdRepo, DeleteExpenseByIdRepo, GetExpensesByBudgetRepo, UpdateExpenseRepo {
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

  async update(expenseData: UpdateExpenseModel): Promise<ExpenseModel> {
    const budgetRef = FirestoreHelper.getCollection('budgets').doc(expenseData.budgetId)

    if ((await budgetRef.get()).exists) {
      const expenseRef = budgetRef.collection('expenses').doc(expenseData.id)
      const firestoreExpenseData = (await expenseRef.get()).data()
      
      if (!firestoreExpenseData) return null
      
      await expenseRef.update(expenseData)
      
      return new Promise(resolve => resolve(firestoreExpenseData as ExpenseModel))
    }
    return null
  }

  async getById(id: string, budgetId: string): Promise<ExpenseModel> {
    const expenseDoc = FirestoreHelper.getCollection(`budgets/${budgetId}/expenses`).doc(id)
    const expense = (await expenseDoc.get()).data()
    return expense as ExpenseModel || null
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

  async getByBudget(id: string, userId: string): Promise<ExpenseModel[]> {
    const budgetData = (await FirestoreHelper.getCollection('budgets').doc(id).get()).data()

    if ((budgetData) && (budgetData.userId !== userId)) return null

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
