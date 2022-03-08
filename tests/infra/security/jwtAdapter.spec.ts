import { verify } from 'crypto'
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
  },

  async verify (): Promise<string> {
    return new Promise(resolve => resolve('value'))
  }
}))

describe('JWT Adapter', () => {
  describe('sign', () => {
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
  
      await expect(promise).rejects.toThrow()
    })
  })
  describe('verify', () => {
    test('Should call verify with correct values', async () => {
      const { sut } = makeSUT()
  
      const signSpy = jest.spyOn(jwt, 'verify')
      await sut.decrypt('token')
  
      expect(signSpy).toHaveBeenCalledWith('token', 'secret')
    })
  
    test('Should return a token on verify success', async () => {
      const { sut } = makeSUT()
  
      const value = await sut.decrypt('token')
  
      expect(value).toBe('value')
    })
  
    test('Should throw if verify throws', async () => {
      const { sut } = makeSUT()
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        throw new Error()
      })
  
      const promise = sut.decrypt('token')
  
      await expect(promise).rejects.toThrow()
    })
  })
})
