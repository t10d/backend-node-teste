import { RequiredFieldValidation } from "../../../presentation/helpers/validators/requiredFieldValidation"
import { ValidationComposite } from "../../../presentation/helpers/validators/validatorComposite"
import { Validation } from "../../../presentation/interfaces/validation"

export const makeAddBudgetValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['name', 'totalRealized', 'totalProjected']) {
    validations.push(new RequiredFieldValidation(field))
  }
  return new ValidationComposite(validations)
}