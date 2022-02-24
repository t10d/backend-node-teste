import { UserModel } from "../../../src/domain/models/user"
import { AddUser, AddUserModel } from "../../../src/domain/useCases/addUser"
import { SignUpController } from "../../../src/presentation/controllers/signup/signUp"
import { InvalidParamError, MissingParamError, ServerError } from "../../../src/presentation/errors"
import { EmailValidator } from "../../../src/presentation/interfaces/email-validator"

interface SUTTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addUserStub: AddUser
}

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
      const fakeUser = {
        id: 'id',
        name: 'name',
        email: 'email@email.com',
        password: 'password'
      }

      return new Promise(resolve => resolve(fakeUser))
    }
  }
  return new AddUserStub()
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

describe('SignupController', () => {
  // params tests
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSUT()
    const httpRequest = {
      body: {
        name: 'name',
        password: 'abcde',
        passwordConfirmation: 'abcde'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if no name is provided', async () => {
    const { sut } = makeSUT()
    const httpRequest = {
      body: {
        email: 'email@email.com',
        password: 'abcde',
        passwordConfirmation: 'abcde'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSUT()
    const httpRequest = {
      body: {
        name: 'name',
        email: 'email@email.com',
        passwordConfirmation: 'abcde'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 400 if no passwordConfirmation is provided', async () => {
    const { sut } = makeSUT()
    const httpRequest = {
      body: {
        name: 'name',
        email: 'email@email.com',
        password: 'abcde'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  test('Should return 400 if incorrect email is provided', async () => {
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

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('Should return 400 passwords dont match', async () => {
    const { sut } = makeSUT()

    const httpRequest = {
      body: {
        name: 'name',
        email: 'email@email.com',
        password: 'abcde',
        passwordConfirmation: 'differentPass'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  test('Should return 500 if email validator throw an error', async () => {
    const { sut, emailValidatorStub } = makeSUT()

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = {
      body: {
        name: 'name',
        email: 'email@email.com',
        password: 'abcde',
        passwordConfirmation: 'abcde'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  // add user tests
  test('Should return 500 if add user throw an error', async () => {
    const { sut, addUserStub } = makeSUT()

    jest.spyOn(addUserStub, 'add').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()))
    })

    const httpRequest = {
      body: {
        name: 'name',
        email: 'email@email.com',
        password: 'abcde',
        passwordConfirmation: 'abcde'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should call AddUser with correct values', async () => {
    const { sut, addUserStub } = makeSUT()

    const addSpy = jest.spyOn(addUserStub, 'add')

    const httpRequest = {
      body: {
        name: 'name',
        email: 'email@email.com',
        password: 'abcde',
        passwordConfirmation: 'abcde'
      }
    }

    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'name',
      email: 'email@email.com',
      password: 'abcde'
    })
  })

  // test correct status (200)
  test('Should return 200 if all right', async () => {
    const { sut } = makeSUT()

    const httpRequest = {
      body: {
        name: 'name',
        email: 'email@email.com',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      id: 'id',
      name: 'name',
      email: 'email@email.com',
      password: 'password'
    })
  })
})
