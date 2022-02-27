import { Authentication, AuthModel } from "../../../src/domain/useCases/authentication"
import { AuthController } from "../../../src/presentation/controllers/auth/authController"
import { InvalidParamError, MissingParamError, ServerError } from "../../../src/presentation/errors"
import { badRequest, ok, serverError, unauthorized } from "../../../src/presentation/helpers/httpHelpers"
import { HttpRequest } from "../../../src/presentation/interfaces"
import { EmailValidator } from "../../../src/presentation/interfaces/emailValidator"
import { Validation } from "../../../src/presentation/interfaces/validation"

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (auth: AuthModel): Promise<string> {
      return new Promise(resolve => resolve('token'))
    }
  }
  return new AuthenticationStub()
}

const makeValidation = (): Validation => {
  class ValidadionStub implements Validation {
    validate (data: any): Error {
      return null
    }
  }
  return new ValidadionStub()
}

interface SUTTypes {
  sut: AuthController
  validationStub: Validation
  authenticationStub: Authentication
}

const makeSUT = (): SUTTypes => {
  const validationStub = makeValidation()
  const authenticationStub = makeAuthentication()
  const SUT = new AuthController(authenticationStub, validationStub)

  return {
    sut: SUT,
    validationStub: validationStub,
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
  test('Should return 500 if Authentication throw an error', async () => {
    const { sut, authenticationStub } = makeSUT()

    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => {
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

    expect(authSpy).toHaveBeenCalledWith(
      { email: httpRequest.body.email, password: httpRequest.body.password 
    })
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

  test('Should return 200 if Authentication success', async () => {
    const { sut } = makeSUT()

    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    
    expect(httpResponse).toEqual(ok({ accessToken: 'token' }))
  })

  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSUT()

    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 with validation fails', async () => {
    const { sut, validationStub } = makeSUT()

    jest.spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('any_param'))
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_param')))
  })
})
