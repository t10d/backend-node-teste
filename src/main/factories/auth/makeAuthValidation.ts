import { EmailValidation } from "../../../presentation/helpers/validators/emailValidation"
import { RequiredFieldValidation } from "../../../presentation/helpers/validators/requiredFieldValidation"
import { Validation } from "../../../presentation/interfaces/validation"
import { ValidationComposite } from "../../../presentation/helpers/validators/validatorComposite"
import { EmailValidatorAdapter } from "../../adapters/emailValidatorAdapter"

export const makeAuthValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}