import jwt from 'jsonwebtoken'
import { JWTAdapter } from '../../../src/infra/security/jwtAdapter'

interface SUTTypes {
  sut: JWTAdapter
}

const makeSUT = (): SUTTypes => {
  const sut = new JWTAdapter('secret')
  return {
    sut
  }
}

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return new Promise(resolve => resolve('token'))
  }
}))

describe('JWT Adapter', () => {
  test('Should call sign with correct values', async () => {
    const { sut } = makeSUT()

    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('id')

    expect(signSpy).toHaveBeenCalledWith({ id: 'id' }, 'secret')
  })

  test('Should return a token on sign success', async () => {
    const { sut } = makeSUT()

    const accessToken = await sut.encrypt('id')

    expect(accessToken).toBe('token')
  })

  test('Should throw if sign throws', async () => {
    const { sut } = makeSUT()
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.encrypt('id')

    expect(promise).rejects.toThrow()
  })
})
