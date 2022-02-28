import { DbDeleteBudget } from "../../../data/useCases/budget/dbDeleteBudget"
import { BudgetFirestoreRepo } from "../../../infra/db/firestore/budgetFirestoreRepo"
import { DeleteBudgetController } from "../../../presentation/controllers/budget/DeleteBudgetController"
import { RequiredFieldValidation } from "../../../presentation/helpers/validators/requiredFieldValidation"
import { ValidationComposite } from "../../../presentation/helpers/validators/validatorComposite"
import { Controller } from "../../../presentation/interfaces"
import { LogControllerDecorator } from "../../decorators/logControllerDecorator"

export const makeDeleteBudgetController = (): Controller => {
  const budgetFirestoreRepo = new BudgetFirestoreRepo()
  const dbDeleteBudget = new DbDeleteBudget(budgetFirestoreRepo)
  const validationComposite = new ValidationComposite([new RequiredFieldValidation('id')])
  const deleteBudgetController = new DeleteBudgetController(dbDeleteBudget, validationComposite)
  return new LogControllerDecorator(deleteBudgetController)
}