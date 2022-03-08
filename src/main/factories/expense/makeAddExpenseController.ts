import { DbAddExpense } from "../../../data/useCases/expense/dbAddExpense"
import { ExpenseFirestoreRepo } from "../../../infra/db/firestore/expenseFirestoreRepo"
import { AddExpenseController } from "../../../presentation/controllers/expense/AddExpenseController"
import { Controller } from "../../../presentation/interfaces"
import { LogControllerDecorator } from "../../decorators/logControllerDecorator"
import { makeAddExpenseValidation } from "./makeAddExpenseValidation"

export const makeAddExpenseController = (): Controller => {
  const expenseFirestoreRepo = new ExpenseFirestoreRepo()
  const dbAddExpense = new DbAddExpense(expenseFirestoreRepo)
  const addExpenseController = new AddExpenseController(dbAddExpense, makeAddExpenseValidation())
  return new LogControllerDecorator(addExpenseController)
}