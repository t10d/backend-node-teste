import { Encrypter } from "../../../src/data/interfaces/encripter"
import { DbAddUser } from "../../../src/data/useCases/addUser/dbAddUser"

interface SUTTypes {
  sut: DbAddUser
  encrypterStub: Encrypter
}

const makeSUT = (): SUTTypes => {
  class EncrypterStub {
    async encrypt (password: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }
  const encrypterStub = new EncrypterStub()
  const sut = new DbAddUser(encrypterStub)

  return {
    sut,
    encrypterStub
  }
}

describe('DbAddUser UseCase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSUT()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const userData = {
      name: 'any_name',
      email: 'email@email.com',
      password: 'any_password'
    }

    await sut.add(userData)

    expect(encryptSpy).toHaveBeenCalledWith('any_password')
  })
})
