import { Decrypter } from "../../../src/data/interfaces/security/decrypter"
import { DbGetUserByToken } from "../../../src/data/useCases/addUser/dbGetUserByToken"

interface SUTTypes {
  sut: DbGetUserByToken
  decrypterStub: Decrypter
}

const makeDecrypterStub = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt(value: string): Promise<string> {
      return new Promise(resolve => resolve('string_decrypted'))
    }
  }

  return new DecrypterStub()
}

const makeSUT = (): SUTTypes => {
  const decrypterStub = makeDecrypterStub()
  const sut = new DbGetUserByToken(
    decrypterStub
  )

  return {
    sut,
    decrypterStub,
  }
}

describe('DbGetUserByYoken UseCase', () => {
  test('Should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSUT()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    
    await sut.getByToken('token', 'role')

    expect(decryptSpy).toHaveBeenCalledWith('token')
  })
})
