import { UserModel } from "../../../src/domain/models/userModel"
import { AddUser, AddUserModel } from "../../../src/domain/useCases/addUser"
import { SignUpController } from "../../../src/presentation/controllers/signup/signUpController"
import { EmailInUseError, MissingParamError, ServerError } from "../../../src/presentation/errors"
import { badRequest, forbidden, ok, serverError } from "../../../src/presentation/helpers/httpHelpers"
import { Validation } from "../../../src/presentation/interfaces/validation"
import { HttpRequest } from "../../../src/presentation/interfaces"
import { Authentication, AuthModel } from "../../../src/domain/useCases/authentication"

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'name',
    email: 'email@email.com',
    password: 'password',
    passwordConfirmation: 'password'
  }
})

const makeUserModel = (): UserModel => ({
  id: 'id',
  name: 'name',
  email: 'email@email.com',
  password: 'password'
})

const makeAddUserStub = (): AddUser => {
  class AddUserStub implements AddUser {
    async add (user: AddUserModel): Promise<UserModel> {
      const fakeUser = makeUserModel()

      return new Promise(resolve => resolve(fakeUser))
    }
  }
  return new AddUserStub()
}

const makeValidation = (): Validation => {
  class ValidadionStub implements Validation {
    validate (data: any): Error {
      return null
    }
  }
  return new ValidadionStub()
}

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (auth: AuthModel): Promise<string> {
      return new Promise(resolve => resolve('token'))
    }
  }
  return new AuthenticationStub()
}

interface SUTTypes {
  sut: SignUpController
  addUserStub: AddUser
  validationStub: Validation
  authStub: Authentication
}

const makeSUT = (): SUTTypes => {
  const addUserStub = makeAddUserStub()
  const validationStub = makeValidation()
  const authStub = makeAuthentication()
  const SUT = new SignUpController(addUserStub, validationStub, authStub)

  return {
    sut: SUT,
    addUserStub: addUserStub,
    validationStub: validationStub,
    authStub: authStub
  }
}

describe('SignupController', () => {
  test('Should return 500 if add user throw an error', async () => {
    const { sut, addUserStub } = makeSUT()

    jest.spyOn(addUserStub, 'add').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()))
    })

    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(serverError(new ServerError('Something went really wrong')))
  })

  test('Should call AddUser with correct values', async () => {
    const { sut, addUserStub } = makeSUT()

    const addSpy = jest.spyOn(addUserStub, 'add')
    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)

    const fakeUserModel = makeUserModel()
    delete fakeUserModel.id

    expect(addSpy).toHaveBeenCalledWith(fakeUserModel)
  })

  test('Should return 403 if AddUser returns null', async () => {
    const { sut, addUserStub } = makeSUT()
    jest.spyOn(addUserStub, 'add').mockReturnValueOnce(
      new Promise(resolve => resolve(null)))

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })

  test('Should return 200 if all right', async () => {
    const { sut } = makeSUT()

    const httpResponse = await sut.handle(makeFakeRequest())

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

  test('Should call Auth with correct values', async () => {
    const { sut, authStub } = makeSUT()

    const authSpy = jest.spyOn(authStub, 'auth')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)

    expect(authSpy).toHaveBeenCalledWith(
      { email: httpRequest.body.email, password: httpRequest.body.password 
    })
  })

  test('Should return 500 if Authentication throw an error', async () => {
    const { sut, authStub } = makeSUT()

    jest.spyOn(authStub, 'auth').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    
    expect(httpResponse).toEqual(serverError(new ServerError('Something went really wrong')))
  })
})
