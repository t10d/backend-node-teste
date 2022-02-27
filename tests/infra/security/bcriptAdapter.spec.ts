import bcrypt from 'bcrypt'
import { Hasher } from '../../../src/data/interfaces/security/hasher'
import { BcriptAdapter } from '../../../src/infra/security/bcriptAdapter'

interface SUTTypes {
  sut: Hasher
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
  test('Should call bcrypt.hash with correct value', async () => {
    const { sut, salt } = makeSUT()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash('any_value')

    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('Should bcrypt.hash return a hash on success', async () => {
    const { sut } = makeSUT()
    const hashedValue = await sut.hash('any_value')

    expect(hashedValue).toBe('hashedValue')
  }) 

  test('Should bcrypt error to be catched by SignUpController', async () => {
    const { sut } = makeSUT()

    // mock bcrypt with a thrown error
    jest.spyOn(bcrypt, 'hash').mockImplementation((pass, salt, cb) => cb(null, ''))

    const promiseHashedValue = sut.hash('any_value')

    await expect(promiseHashedValue).rejects.toThrow()
  })

  test('Should call bcrypt.compare with correct value', async () => {
    const { sut } = makeSUT()
    const compareSpy = jest.spyOn(bcrypt, 'compare')
    await sut.compare('any_value', 'hash')

    expect(compareSpy).toHaveBeenCalledWith('any_value', 'hash')
  })

  test('Should bcrypt.compare return true success', async () => {
    const { sut } = makeSUT()
    const isValid = await sut.compare('any_value', 'hash')

    expect(isValid).toBe(true)
  }) 
})
