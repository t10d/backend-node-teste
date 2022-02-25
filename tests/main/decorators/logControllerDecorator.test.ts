import { LogControllerDecorator } from "../../../src/main/decorators/logControllerDecorator"
import { Controller, HttpRequest, HttpResponse } from "../../../src/presentation/interfaces"

interface SUTTypes {
  sut: Controller
}

const makeSUT = (): SUTTypes => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse = {
        statusCode: 200,
        body: {
          name: 'name',
          email: 'email@email.com',
          password: 'password',
          passwordConfirmation: 'password'
        }
      }
      return new Promise(resolve => resolve(httpResponse))
    }
  }

  const controllerStub = new ControllerStub()
  const SUT = new LogControllerDecorator(controllerStub)

  return {
    sut: SUT 
  }
}

describe('LogController Decorator', () => {
  test('Should call Controller.handle() correctly', async () => {
    const { sut } = makeSUT()
    const handleSpy = jest.spyOn(sut, 'handle')

    const httpRequest = {
      body: {
        name: 'name',
        email: 'email@email.com',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }

    await sut.handle(httpRequest)

    expect(sut.handle).toHaveBeenCalledWith(httpRequest)
  })
})
