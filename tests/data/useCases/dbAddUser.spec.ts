import { DbAddUser } from "../../../src/data/useCases/addUser/dbAddUser"

describe('DbAddUser UseCase', () => {
  test('Should call Encrypter with correct password', async () => {
    class EncrypterStub {
      async encrypt (password: string): Promise<string> {
        return new Promise(resolve => resolve('hashed_password'))
      }
    }
    const encrypterStub = new EncrypterStub()
    const sut = new DbAddUser(encrypterStub)
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
