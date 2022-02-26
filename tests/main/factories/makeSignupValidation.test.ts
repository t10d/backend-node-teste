import { makeSignUpValidation } from "../../../src/main/factories/makeSignupValidation"
import { CompareFieldsValidation } from "../../../src/presentation/helpers/validators/compareFieldsValidation";
import { EmailValidation } from "../../../src/presentation/helpers/validators/emailValidation";
import { RequiredFieldValidation } from "../../../src/presentation/helpers/validators/requiredFieldValidation";
import { Validation } from "../../../src/presentation/interfaces/validation";
import { ValidationComposite } from "../../../src/presentation/helpers/validators/validatorComposite"
import { EmailValidator } from "../../../src/presentation/interfaces/emailValidator";

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
    makeSignUpValidation()
    const validations: Validation[] = []

    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
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