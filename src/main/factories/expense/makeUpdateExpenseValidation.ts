import { RequiredFieldValidation } from "../../../presentation/helpers/validators/requiredFieldValidation"
import { ValidationComposite } from "../../../presentation/helpers/validators/validatorComposite"
import { Validation } from "../../../presentation/interfaces/validation"

export const makeUpdateExpenseValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ["id", "budgetId"]) {
    validations.push(new RequiredFieldValidation(field))
  }
  return new ValidationComposite(validations)
}