import { RequiredFieldValidation } from "../../../presentation/helpers/validators/requiredFieldValidation"
import { ValidationComposite } from "../../../presentation/helpers/validators/validatorComposite"
import { Validation } from "../../../presentation/interfaces/validation"

export const makeBudgetValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['name', 'total_realized', 'total_projected']) {
    validations.push(new RequiredFieldValidation(field))
  }
  return new ValidationComposite(validations)
}