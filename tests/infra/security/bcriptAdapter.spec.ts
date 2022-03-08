import bcrypt from 'bcrypt'
import { BcriptAdapter } from '../../../src/infra/security/bcriptAdapter'

interface SUTTypes {
  sut: BcriptAdapter
  salt: number
}

const makeSUT = (): SUTTypes => {
  const salt = 12
  const sut = new BcriptAdapter(salt)
  return {
    sut,
    salt
  }
}

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve('hashedValue'))
  },

  async compare (): Promise<boolean> {
    return await new Promise(resolve => resolve(true))
  }
}))

describe('Bcript Adapter', () => {
  describe('hash', () => {
    test('Should call BcriptAdapter.hash with correct value', async () => {
      const { sut, salt } = makeSUT()
      const hashSpy = jest.spyOn(bcrypt, 'hash')
      await sut.hash('any_value')
  
      expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
    })
  
    test('Should BcriptAdapter.hash return a hash on success', async () => {
      const { sut } = makeSUT()
      const hashedValue = await sut.hash('any_value')
  
      expect(hashedValue).toBe('hashedValue')
    }) 
  
    test('Should throws if BcriptAdapter.hash throws', async () => {
      const { sut } = makeSUT()
  
      // mock bcrypt with a thrown error
      jest.spyOn(bcrypt, 'hash')
        .mockImplementationOnce(
          () => new Promise((resolve, rejects) => rejects(new Error())))
  
      const promiseHashedValue = sut.hash('any_value')
  
      await expect(promiseHashedValue).rejects.toThrow()
    })
  })
  
  describe('compare', () => {
    test('Should call BcriptAdapter.compare with correct value', async () => {
      const { sut } = makeSUT()
      const compareSpy = jest.spyOn(bcrypt, 'compare')
      await sut.compare('any_value', 'hash')

      expect(compareSpy).toHaveBeenCalledWith('any_value', 'hash')
    })

    test('Should return true in BcriptAdapter.compare success', async () => {
      const { sut } = makeSUT()
      const isValid = await sut.compare('any_value', 'hash')

      expect(isValid).toBe(true)
    }) 

    test('Should return false in BcriptAdapter.compare fail', async () => {
      const { sut } = makeSUT()
      jest.spyOn(bcrypt, 'compare')
        .mockImplementationOnce(() => false)
      
      const isValid = await sut.compare('any_value', 'hash')

      expect(isValid).toBe(false)
    }) 

    test('Should throws if BcriptAdapter.compare throws', async () => {
      const { sut } = makeSUT()

      // mock bcrypt with a thrown error
      jest.spyOn(bcrypt, 'compare')
        .mockImplementationOnce(
          () => new Promise((resolve, rejects) => rejects(new Error())))

      const promise = sut.compare('any_value', 'hash')

      await expect(promise).rejects.toThrow()
    })
  })
})
