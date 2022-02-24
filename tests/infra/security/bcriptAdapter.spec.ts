import bcrypt from 'bcrypt'
import { Encrypter } from '../../../src/data/interfaces/encripter'
import { BcriptAdapter } from '../../../src/infra/security/bcriptAdapter'

interface SUTTypes {
  sut: Encrypter
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

describe('Bcript Adapter', () => {
  test('Should call bcrypt with correct value', async () => {
    const { sut, salt } = makeSUT()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')

    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })
})
