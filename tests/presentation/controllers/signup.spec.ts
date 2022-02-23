import { UserModel } from "../../../src/domain/models/user"
import { AddUser, AddUserModel } from "../../../src/domain/useCases/add-user"
import { SignUpController } from "../../../src/presentation/controllers/signup/signup"
import { InvalidParamError, MissingParamError, ServerError } from "../../../src/presentation/errors"
import { EmailValidator } from "../../../src/presentation/interfaces/email-validator"

interface SUTTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addUserStub: AddUser
}

const makeSUT = (): SUTTypes => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  class AddUserStub implements AddUser {
    add (user: AddUserModel): UserModel {
      const fakeUser = {
        id: 'id',
        name: 'name',
        email: 'email@email.com',
        password: 'password'
      }

      return fakeUser
    }
  }

  const emailValidatorStub = new EmailValidatorStub()
  const addUserStub = new AddUserStub()
  const SUT = new SignUpController(emailValidatorStub, addUserStub)

  return {
    sut: SUT,
    emailValidatorStub: emailValidatorStub,
    addUserStub: addUserStub
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

  test('Should return 400 passwords dont match', () => {
    const { sut } = makeSUT()

    const httpRequest = {
      body: {
        name: 'name',
        email: 'email@email.com',
        password: 'abcde',
        passwordConfirmation: 'differentPass'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  test('Should return 500 if email validator throw an error', () => {
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

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should call AddUser with correct values', () => {
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

    sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'name',
      email: 'email@email.com',
      password: 'abcde'
    })
  })
})
