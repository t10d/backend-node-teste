import { UserModel } from "../../../src/domain/models"
import { GetUserByToken } from "../../../src/domain/useCases/getUserByToken"
import { ServerError } from "../../../src/presentation/errors"
import { MissingAuthTokenError } from "../../../src/presentation/errors/missingAuthTokenError"
import { forbidden, ok, serverError } from "../../../src/presentation/helpers/httpHelpers"
import { HttpRequest } from "../../../src/presentation/interfaces"
import { Middleware } from "../../../src/presentation/interfaces/middleware"
import { AuthMiddleware } from "../../../src/presentation/middlewares/authMiddleware"

const makeUserModel = (): UserModel => ({
  id: 'id',
  name: 'name',
  email: 'email@email.com',
  password: 'password'
})

const makeGetUserByTokenStub = (): GetUserByToken => {
  class GetUserByTokenStub implements GetUserByToken {
    async getByToken(accessToken: string, role?: string): Promise<UserModel> {
      return new Promise(resolve => resolve(makeUserModel()))
    }
  }
  return new GetUserByTokenStub()
}

interface SUTTypes {
  sut: Middleware
  getUserByTokenStub: GetUserByToken
}

const makeSUT = (role?: string): SUTTypes => {
  const getUserByTokenStub = makeGetUserByTokenStub()
  const sut = new AuthMiddleware(getUserByTokenStub, role)

  return {
    sut,
    getUserByTokenStub
  }
}

const makeFakeRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'token'
  }
})

describe('Auth Middleware', () => {
  test('Shoud return 403 if x-access-token doesnt exists in headers', async () => {
    const { sut } = makeSUT()
    const HttpResponse = await sut.handle({})

    expect(HttpResponse).toEqual(forbidden(new MissingAuthTokenError()))
  })

  test('Shoud call GetUserByToken with correct accessToken', async () => {
    const { sut, getUserByTokenStub } = makeSUT('any_role')
    const getSpy = jest.spyOn(getUserByTokenStub, 'getByToken')
    await sut.handle(makeFakeRequest())

    expect(getSpy).toHaveBeenCalledWith('token', 'any_role')
  })

  test('Shoud return 403 if GetUserByToken returns null', async () => {
    const { sut, getUserByTokenStub } = makeSUT()
    jest.spyOn(getUserByTokenStub, 'getByToken').mockReturnValueOnce(
      new Promise(resolve => resolve(null))
    )
    const httpReponse = await sut.handle({})

    expect(httpReponse).toEqual(forbidden(new MissingAuthTokenError()))
  })
 
  test('Shoud return 200 if GetUserByToken returns an account', async () => {
    const { sut } = makeSUT()

    const httpReponse = await sut.handle(makeFakeRequest())

    expect(httpReponse).toEqual(ok({ userID: 'id' }))
  })

  test('Should return 500 if GetUserByToken throw an error', async () => {
    const { sut, getUserByTokenStub } = makeSUT()

    jest.spyOn(getUserByTokenStub, 'getByToken').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()))
    })

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(serverError(new ServerError('Internal error')))
  })
})