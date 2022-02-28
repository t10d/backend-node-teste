import { DbDeleteBudget } from "../../../data/useCases/budget/dbDeleteBudget"
import { BudgetFirestoreRepo } from "../../../infra/db/firestore/budgetFirestoreRepo"
import { DeleteBudgetController } from "../../../presentation/controllers/budget/DeleteBudgetController"
import { Controller } from "../../../presentation/interfaces"
import { LogControllerDecorator } from "../../decorators/logControllerDecorator"
import { makeDeleteBudgetValidation } from "./makeDeleteBudgetValidation"

export const makeDeleteBudgetController = (): Controller => {
  const budgetFirestoreRepo = new BudgetFirestoreRepo()
  const dbDeleteBudget = new DbDeleteBudget(budgetFirestoreRepo)
  const deleteBudgetController = new DeleteBudgetController(dbDeleteBudget, makeDeleteBudgetValidation())
  return new LogControllerDecorator(deleteBudgetController)
}