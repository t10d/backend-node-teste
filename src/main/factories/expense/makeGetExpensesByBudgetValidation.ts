import { RequiredFieldValidation } from "../../../presentation/helpers/validators/requiredFieldValidation"
import { ValidationComposite } from "../../../presentation/helpers/validators/validatorComposite"
import { Validation } from "../../../presentation/interfaces/validation"

export const makeGetExpensesByBudgetValidation = (): ValidationComposite => {
  const validations: Validation[] = []

  validations.push(new RequiredFieldValidation('budgetId'))

  return new ValidationComposite(validations)
}