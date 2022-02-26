import { RequiredFieldValidation } from "../../presentation/helpers/validators/requitedFieldValidation"
import { Validation } from "../../presentation/helpers/validators/validation"
import { ValidationComposite } from "../../presentation/helpers/validators/validatorComposite"

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field))
  }
  return new ValidationComposite(validations)
}