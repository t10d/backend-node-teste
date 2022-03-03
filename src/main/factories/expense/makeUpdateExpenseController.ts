import { DbUpdateExpense } from "../../../data/useCases/expense/dbUpdateExpense"
import { ExpenseFirestoreRepo } from "../../../infra/db/firestore/expenseFirestoreRepo"
import { UpdateExpenseController } from "../../../presentation/controllers/expense/UpdateExpenseController"
import { Controller } from "../../../presentation/interfaces"
import { LogControllerDecorator } from "../../decorators/logControllerDecorator"
import { makeUpdateExpenseValidation } from "./makeUpdateExpenseValidation"

export const makeUpdateExpenseController = (): Controller => {
  const expenseFirestoreRepo = new ExpenseFirestoreRepo()
  const dbUpdateExpense = new DbUpdateExpense(expenseFirestoreRepo)
  const updateExpenseController = new UpdateExpenseController(dbUpdateExpense, makeUpdateExpenseValidation())
  return new LogControllerDecorator(updateExpenseController)
}