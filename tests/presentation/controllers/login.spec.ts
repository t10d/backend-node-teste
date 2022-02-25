import { LoginController } from "../../../src/presentation/controllers/login/login"
import { InvalidParamError, MissingParamError } from "../../../src/presentation/errors"
import { badRequest } from "../../../src/presentation/helpers/http-helpers"
import { HttpRequest } from "../../../src/presentation/interfaces"
import { EmailValidator } from "../../../src/presentation/interfaces/email-validator"

interface SUTTypes {
  sut: LoginController
  emailValidatorStub: EmailValidator
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
  const SUT = new LoginController(emailValidatorStub)

  return {
    sut: SUT,
    emailValidatorStub: emailValidatorStub
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
}) 