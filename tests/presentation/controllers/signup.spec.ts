import { UserModel } from "../../../src/domain/models/user"
import { AddUser, AddUserModel } from "../../../src/domain/useCases/addUser"
import { SignUpController } from "../../../src/presentation/controllers/signup/signUp"
import { InvalidParamError, MissingParamError, ServerError } from "../../../src/presentation/errors"
import { badRequest, ok, serverError } from "../../../src/presentation/helpers/http-helpers"
import { HttpRequest } from "../../../src/presentation/interfaces"
import { EmailValidator } from "../../../src/presentation/interfaces/email-validator"

interface SUTTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addUserStub: AddUser
}

const makeSUT = (): SUTTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addUserStub = makeAddUserStub()
  const SUT = new SignUpController(emailValidatorStub, addUserStub)

  return {
    sut: SUT,
    emailValidatorStub: emailValidatorStub,
    addUserStub: addUserStub
  }
}

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

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAddUserStub = (): AddUser => {
  class AddUserStub implements AddUser {
    async add (user: AddUserModel): Promise<UserModel> {
      const fakeUser = makeUserModel()

      return new Promise(resolve => resolve(fakeUser))
    }
  }
  return new AddUserStub()
}

describe('SignupController', () => {
  // params tests
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSUT()
    const httpRequest = makeFakeRequest()
    delete httpRequest.body.email
    const httpResponse = await sut.handle(httpRequest)
    
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Should return 400 if no name is provided', async () => {
    const { sut } = makeSUT()
    const httpRequest = makeFakeRequest()
    delete httpRequest.body.name
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('name')))
  })

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSUT()
    const httpRequest = makeFakeRequest()
    delete httpRequest.body.password
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('Should return 400 if no passwordConfirmation is provided', async () => {
    const { sut } = makeSUT()
    const httpRequest = makeFakeRequest()
    delete httpRequest.body.passwordConfirmation
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('passwordConfirmation')))
  })

  test('Should return 400 if incorrect email is provided', async () => {
    const { sut, emailValidatorStub } = makeSUT()

    // force emailValidatorStub returns false
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('Should return 400 passwords dont match', async () => {
    const { sut } = makeSUT()

    const httpRequest = makeFakeRequest()
    httpRequest.body.password = 'differentPassword'
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('passwordConfirmation')))
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

  // add user tests
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

  // test correct status (200)
  test('Should return 200 if all right', async () => {
    const { sut } = makeSUT()

    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(ok(makeUserModel()))
  })
})
