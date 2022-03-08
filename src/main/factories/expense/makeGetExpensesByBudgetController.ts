import { DbGetExpensesByBudget } from "../../../data/useCases/expense/dbGetExpensesByBudget"
import { ExpenseFirestoreRepo } from "../../../infra/db/firestore/expenseFirestoreRepo"
import { GetExpensesByBudgetController } from "../../../presentation/controllers/expense/getExpensesByBudgetController"
import { Controller } from "../../../presentation/interfaces"
import { LogControllerDecorator } from "../../decorators/logControllerDecorator"
import { makeGetExpensesByBudgetValidation } from "./makeGetExpensesByBudgetValidation"

export const makeGetExpensesByBudgetController = (): Controller => {
  const expenseFirestoreRepo = new ExpenseFirestoreRepo()
  const dbGetExpensesByBudget = new DbGetExpensesByBudget(expenseFirestoreRepo)
  const getExpensesByBudgetController = new GetExpensesByBudgetController(dbGetExpensesByBudget, makeGetExpensesByBudgetValidation())
  return new LogControllerDecorator(getExpensesByBudgetController)
}