import { DeleteExpenseByIdRepo } from "../../../data/interfaces/db/expense/deleteExpenseById"
import { GetExpenseByIdRepo } from "../../../data/interfaces/db/expense/getExpenseById"
import { AddExpenseRepo } from "../../../data/useCases/expense/interfaces"
import { ExpenseModel } from "../../../domain/models"
import { AddExpenseModel } from "../../../domain/useCases"
import { FirestoreHelper } from "./helpers/firestoreHelper"

export class ExpenseFirestoreRepo implements AddExpenseRepo, GetExpenseByIdRepo, DeleteExpenseByIdRepo {
  async add (expenseData: AddExpenseModel): Promise<ExpenseModel> {
    const budgetCol = FirestoreHelper.getCollection('budgets')
    const budgetDoc = budgetCol.doc(expenseData.budgetId)
    const budgetData = await budgetDoc.get()

    if (budgetData.exists) {
      const expenseRef = FirestoreHelper.getCollection('expenses').doc()
      const expenseObject = { id: expenseRef.id, ...expenseData }
      await expenseRef.set(expenseObject)
      const budgetExpenses = budgetData.data().expenses || []

      budgetDoc.update({
        expenses: [ ...budgetExpenses, expenseRef ]
      })
      
      return new Promise(resolve => resolve(expenseObject))
    }
    return null
  }

  async getById(id: string): Promise<ExpenseModel> {
    const expenseDoc = FirestoreHelper.getCollection('expenses').doc(id)
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

  async deleteById(id: string): Promise<string> {
    const expenseDoc = FirestoreHelper.getCollection('expenses').doc(id)
    const expense = (await expenseDoc.get()).data()
    if (expense) {
      await expenseDoc.delete()
      return expenseDoc.id
    }
    return null
  }
}
