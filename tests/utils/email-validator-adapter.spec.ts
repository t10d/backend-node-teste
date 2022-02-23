import { EmailValidatorAdapter } from "../../src/utils/email-validator-adapter"
import validator from "validator"

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

const makeSUT = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}

describe('EmailValidatorAdapter', () => {
  test('Should return false if EmailValidator returns false', () => {
    const SUT = makeSUT()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = SUT.isValid('invalid_email@email.com')

    expect(isValid).toBe(false)
  })

  test('Should return true if EmailValidator returns true', () => {
    const SUT = makeSUT()
    const isValid = SUT.isValid('email@email.com')

    expect(isValid).toBe(true)
  })

  test('Should call with correct email', () => {
    const SUT = makeSUT()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    SUT.isValid('email@email.com')

    expect(isEmailSpy).toHaveBeenCalledWith('email@email.com')
  })
})
