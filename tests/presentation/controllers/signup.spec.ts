import { SignUpController } from "../../../src/presentation/controllers/signup"
import { InvalidParamError, MissingParamError } from "../../../src/presentation/errors/param-errors"
import { ServerError } from "../../../src/presentation/errors/server-error"
import { EmailValidator } from "../../../src/presentation/interfaces/email-validator"

interface SUTTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
}

const makeSUT = (): SUTTypes => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  const emailValidatorStub = new EmailValidatorStub()
  const SUT = new SignUpController(emailValidatorStub)

  return {
    sut: SUT,
    emailValidatorStub: emailValidatorStub
  }
}

describe('SignupController', () => {
  test('Should return 400 if no email is provided', () => {
    const { sut } = makeSUT()
    const httpRequest = {
      body: {
        name: 'name',
        password: 'abcde',
        passwordConfirmation: 'abcde'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if no name is provided', () => {
    const { sut } = makeSUT()
    const httpRequest = {
      body: {
        email: 'email@email.com',
        password: 'abcde',
        passwordConfirmation: 'abcde'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('Should return 400 if no password is provided', () => {
    const { sut } = makeSUT()
    const httpRequest = {
      body: {
        name: 'name',
        email: 'email@email.com',
        passwordConfirmation: 'abcde'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 400 if no passwordConfirmation is provided', () => {
    const { sut } = makeSUT()
    const httpRequest = {
      body: {
        name: 'name',
        email: 'email@email.com',
        password: 'abcde'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  test('Should return 400 if incorrect email is provided', () => {
    const { sut, emailValidatorStub } = makeSUT()

    // force emailValidatorStub returns false
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        name: 'name',
        email: 'email@email.com',
        password: 'abcde',
        passwordConfirmation: 'abcde'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('Should return 500 if email validator throw an error', () => {
    class EmailValidatorStub implements EmailValidator {
      isValid (email: string): boolean {
        throw new Error()
      }
    }

    const emailValidatorStub = new EmailValidatorStub()
    const sut = new SignUpController(emailValidatorStub)

    const httpRequest = {
      body: {
        name: 'name',
        email: 'email@email.com',
        password: 'abcde',
        passwordConfirmation: 'abcde'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})
