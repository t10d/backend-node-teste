import { SignUpController } from "../../../src/presentation/controllers/signup"
import { MissingParamError } from "../../../src/presentation/errors/missing-param-error"

const makeSUT = (): SignUpController => {
  return new SignUpController()
}

describe('SignupController', () => {
  test('Should return 400 if no email is provided', () => {
    const sut = makeSUT()
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
})

describe('SignupController', () => {
  test('Should return 400 if no name is provided', () => {
    const sut = makeSUT()
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
})

describe('SignupController', () => {
  test('Should return 400 if no password is provided', () => {
    const sut = makeSUT()
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
})

describe('SignupController', () => {
  test('Should return 400 if no passwordConfirmation is provided', () => {
    const sut = makeSUT()
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
})
