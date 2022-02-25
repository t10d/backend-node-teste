import { Authentication } from "../../../src/domain/useCases/authentication"
import { LoginController } from "../../../src/presentation/controllers/login/login"
import { InvalidParamError, MissingParamError, ServerError } from "../../../src/presentation/errors"
import { badRequest, serverError, unauthorized } from "../../../src/presentation/helpers/http-helpers"
import { HttpRequest } from "../../../src/presentation/interfaces"
import { EmailValidator } from "../../../src/presentation/interfaces/email-validator"

interface SUTTypes {
  sut: LoginController
  emailValidatorStub: EmailValidator
  authenticationStub: Authentication
}

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (email: string, password: string): Promise<string> {
      return new Promise(resolve => resolve('token'))
    }
  }
  return new AuthenticationStub()
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeSUT = (): SUTTypes => {
  const emailValidatorStub = makeEmailValidator()
  const authenticationStub = makeAuthentication()
  const SUT = new LoginController(emailValidatorStub, authenticationStub)

  return {
    sut: SUT,
    emailValidatorStub: emailValidatorStub,
    authenticationStub: authenticationStub
  }
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'email@email.com',
    password: 'password',
  }
})

describe('Login Controller', () => {
  test('Should return 400 if no email or password is provided', async () => {
    const { sut } = makeSUT()

    const httpRequestEmail = makeFakeRequest()
    delete httpRequestEmail.body.email
    const httpResponseEmail = await sut.handle(httpRequestEmail)
    expect(httpResponseEmail).toEqual(badRequest(new MissingParamError('email')))

    const httpRequestPass = makeFakeRequest()
    delete httpRequestPass.body.password
    const httpResponsePass = await sut.handle(httpRequestPass)
    expect(httpResponsePass).toEqual(badRequest(new MissingParamError('password')))
  })

  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSUT()

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)
    
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email)
  })

  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSUT()

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('Should return 500 if email validator throw an error', async () => {
    const { sut, emailValidatorStub } = makeSUT()

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    
    expect(httpResponse).toEqual(serverError(new ServerError('Something went really wrong')))
  })

  test('Should call Auth with correct values', async () => {
    const { sut, authenticationStub } = makeSUT()

    const authSpy = jest.spyOn(authenticationStub, 'auth')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)

    expect(authSpy).toHaveBeenCalledWith(httpRequest.body.email, httpRequest.body.password)
  })

  test('Should return 401 if user not find', async () => {
    const { sut, authenticationStub } = makeSUT()

    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(
      new Promise(resolve => resolve(null))
    ) 

    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    
    expect(httpResponse).toEqual(unauthorized())
  })
})
