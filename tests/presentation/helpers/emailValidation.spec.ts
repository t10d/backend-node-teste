import { InvalidParamError } from "../../../src/presentation/errors"
import { EmailValidation } from "../../../src/presentation/helpers/validators/emailValidation"
import { EmailValidator } from "../../../src/presentation/interfaces/emailValidator"

type SutTypes = {
  sut: EmailValidation
  emailValidatorSpy: EmailValidatorSpy
}

class EmailValidatorSpy implements EmailValidator {
  isEmailValid = true
  email: string

  isValid (email: string): boolean {
    this.email = email
    return this.isEmailValid
  }
}

const makeSut = (): SutTypes => {
  const emailValidatorSpy = new EmailValidatorSpy()
  const sut = new EmailValidation("anyField", emailValidatorSpy)
  return {
    sut,
    emailValidatorSpy
  }
}

describe('Email Validation', () => {
  test('Should return an error if EmailValidator returns false', () => {
    const { sut, emailValidatorSpy } = makeSut()
    emailValidatorSpy.isEmailValid = false
    const email = 'email@email.com'
    const error = sut.validate({ ["anyField"]: email })
    expect(error).toEqual(new InvalidParamError("anyField"))
  })

  test('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorSpy } = makeSut()
    const email = 'email@email.com'
    sut.validate({ ["anyField"]: email })
    expect(emailValidatorSpy.email).toBe(email)
  })

  test('Should throw if EmailValidator throws', () => {
    const { sut, emailValidatorSpy } = makeSut()
    jest.spyOn(emailValidatorSpy, 'isValid').mockImplementationOnce((): never => {
      throw new Error()
    })
    expect(sut.validate).toThrow()
  })
})