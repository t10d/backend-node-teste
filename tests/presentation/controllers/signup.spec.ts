import { UserModel } from "../../../src/domain/models/user"
import { AddUser, AddUserModel } from "../../../src/domain/useCases/addUser"
import { SignUpController } from "../../../src/presentation/controllers/signup/signUp"
import { InvalidParamError, MissingParamError, ServerError } from "../../../src/presentation/errors"
import { badRequest, ok, serverError } from "../../../src/presentation/helpers/http-helpers"
import { Validation } from "../../../src/presentation/helpers/validators/validation"
import { HttpRequest } from "../../../src/presentation/interfaces"
import { EmailValidator } from "../../../src/presentation/interfaces/email-validator"

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

const makeValidation = (): Validation => {
  class ValidadionStub implements Validation {
    validate (data: any): Error {
      return null
    }
  }
  return new ValidadionStub()
}

interface SUTTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addUserStub: AddUser
  validationStub: Validation
}

const makeSUT = (): SUTTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addUserStub = makeAddUserStub()
  const validationStub = makeValidation()
  const SUT = new SignUpController(emailValidatorStub, addUserStub, validationStub)

  return {
    sut: SUT,
    emailValidatorStub: emailValidatorStub,
    addUserStub: addUserStub,
    validationStub: validationStub
  }
}

describe('SignupController', () => {
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

  test('Should return 200 if all right', async () => {
    const { sut } = makeSUT()

    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(ok(makeUserModel()))
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
