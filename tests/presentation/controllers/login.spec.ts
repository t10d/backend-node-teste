import { LoginController } from "../../../src/presentation/controllers/login/login"
import { MissingParamError } from "../../../src/presentation/errors"
import { badRequest } from "../../../src/presentation/helpers/http-helpers"
import { HttpRequest } from "../../../src/presentation/interfaces"

interface SUTTypes {
  sut: LoginController
}

const makeSUT = (): SUTTypes => {
  const SUT = new LoginController()

  return {
    sut: SUT
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
}) 