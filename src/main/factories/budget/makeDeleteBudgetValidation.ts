import { RequiredFieldValidation } from "../../../presentation/helpers/validators/requiredFieldValidation"
import { ValidationComposite } from "../../../presentation/helpers/validators/validatorComposite"
import { Validation } from "../../../presentation/interfaces/validation"

export const makeDeleteBudgetValidation = (): ValidationComposite => {
  const validations: Validation[] = []

  validations.push(new RequiredFieldValidation('id'))

  return new ValidationComposite(validations)
}