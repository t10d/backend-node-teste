import { RequiredFieldValidation } from "../../../presentation/helpers/validators/requiredFieldValidation"
import { ValidationComposite } from "../../../presentation/helpers/validators/validatorComposite"
import { Validation } from "../../../presentation/interfaces/validation"

export const makeAddExpenseValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ["id", "name", "category", "realized", "projected", "type", "budgetId"]) {
    validations.push(new RequiredFieldValidation(field))
  }
  return new ValidationComposite(validations)
}