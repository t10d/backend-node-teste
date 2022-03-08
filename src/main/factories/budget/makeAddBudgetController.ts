import { DbAddBudget } from "../../../data/useCases/budget/dbAddBudget"
import { BudgetFirestoreRepo } from "../../../infra/db/firestore/budgetFirestoreRepo"
import { AddBudgetController } from "../../../presentation/controllers/budget/AddBudgetController"
import { Controller } from "../../../presentation/interfaces"
import { LogControllerDecorator } from "../../decorators/logControllerDecorator"
import { makeAddBudgetValidation } from "./makeAddBudgetValidation"

export const makeAddBudgetController = (): Controller => {
  const budgetFirestoreRepo = new BudgetFirestoreRepo()
  const dbAddBudget = new DbAddBudget(budgetFirestoreRepo)
  const addBudgetController = new AddBudgetController(dbAddBudget, makeAddBudgetValidation())
  return new LogControllerDecorator(addBudgetController)
}