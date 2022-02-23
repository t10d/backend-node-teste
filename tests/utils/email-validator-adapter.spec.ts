import { EmailValidatorAdapter } from "../../src/utils/email-validator"
import validator from "validator"

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

describe('EmailValidatorAdapter', () => {
  test('Should return false if EmailValidator returns false', () => {
    const SUT = new EmailValidatorAdapter()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = SUT.isValid('invalid_email@email.com')

    expect(isValid).toBe(false)
  })

  test('Should return true if EmailValidator returns true', () => {
    const SUT = new EmailValidatorAdapter()
    const isValid = SUT.isValid('email@email.com')

    expect(isValid).toBe(true)
  })
})
