import { EmailValidation } from "../../../src/presentation/helpers/validators/emailValidation";
import { RequiredFieldValidation } from "../../../src/presentation/helpers/validators/requiredFieldValidation";
import { Validation } from "../../../src/presentation/interfaces/validation";
import { ValidationComposite } from "../../../src/presentation/helpers/validators/validatorComposite"
import { EmailValidator } from "../../../src/presentation/interfaces/emailValidator";
import { makeAuthValidation } from "../../../src/main/factories/auth/makeAuthValidation";

jest.mock("../../../src/presentation/helpers/validators/validatorComposite")

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
} 

describe('SignUpValidation Factory', () => {
  test('Should call Validation with all validations', () => {
    makeAuthValidation()
    const validations: Validation[] = []

    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  }) 

  test('EmailValidation Should throw invalid email when email is invalid', () => {
    const emailValidator = makeEmailValidator()
    const sut = new EmailValidation('email', emailValidator)

    jest.spyOn(emailValidator, 'isValid').mockReturnValueOnce(false)

    expect(sut.validate).toThrow()
  })
})