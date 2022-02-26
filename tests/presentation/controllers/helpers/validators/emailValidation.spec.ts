import { EmailValidation } from "../../../../../src/presentation/helpers/validators/emailValidation"
import { EmailValidator } from "../../../../../src/presentation/interfaces/email-validator"

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

interface SUTTypes {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}

const makeSUT = (): SUTTypes => {
  const emailValidatorStub = makeEmailValidator()
  const SUT = new EmailValidation ('email', emailValidatorStub)

  return {
    sut: SUT,
    emailValidatorStub: emailValidatorStub,
  }
}

describe('Email Validation', () => {
  test('Should throw if email validator throw an error', () => {
    const { sut, emailValidatorStub } = makeSUT()

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    
    expect(sut.validate).toThrow()
  })

  test('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSUT()

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    sut.validate({ email: 'email@email.com' })

    expect(isValidSpy).toHaveBeenCalledWith('email@email.com')
  })
})
