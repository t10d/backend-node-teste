import { GetUserByTokenRepo } from "../../../src/data/interfaces/db/user/getUserByTokenRepo"
import { Decrypter } from "../../../src/data/interfaces/security/decrypter"
import { DbGetUserByToken } from "../../../src/data/useCases/addUser/dbGetUserByToken"
import { UserModel } from "../../../src/domain/models"


const makeDecrypterStub = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt(value: string): Promise<string> {
      return new Promise(resolve => resolve('string_decrypted'))
    }
  }

  return new DecrypterStub()
}

const makeFakeUser = (): UserModel => ({
  id: 'id',
  name: 'any_name',
  email: 'email@email.com',
  password: 'hashed_password'
})

const makeGetUserByTokenRepoStub = (): GetUserByTokenRepo => {
  class GetUserByTokenRepoStub implements GetUserByTokenRepo {
    async getByToken (token: string, role?: string): Promise<UserModel> {
      return new Promise(resolve => resolve(makeFakeUser()))
    }
  }

  return new GetUserByTokenRepoStub()
}

interface SUTTypes {
  sut: DbGetUserByToken
  decrypterStub: Decrypter
  getUserByTokenRepoStub: GetUserByTokenRepo
}

const makeSUT = (): SUTTypes => {
  const decrypterStub = makeDecrypterStub()
  const getUserByTokenRepoStub = makeGetUserByTokenRepoStub()
  const sut = new DbGetUserByToken(
    decrypterStub,
    getUserByTokenRepoStub
  )

  return {
    sut,
    decrypterStub,
    getUserByTokenRepoStub
  }
}

describe('DbGetUserByYoken UseCase', () => {
  test('Should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSUT()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    
    await sut.getByToken('token', 'role')

    expect(decryptSpy).toHaveBeenCalledWith('token')
  })
  
  test('Should return null if decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSUT()
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(
      new Promise(resolve => resolve(null))
    )
    
    const user = await sut.getByToken('token', 'role')

    expect(user).toBeNull()
  })

  test('Should call getUserByToken with correct values', async () => {
    const { sut, getUserByTokenRepoStub } = makeSUT()
    const getUserByTokenSpy = jest.spyOn(getUserByTokenRepoStub, 'getByToken')
    
    await sut.getByToken('token', 'role')

    expect(getUserByTokenSpy).toHaveBeenCalledWith('token', 'role')
  })

  test('Should return null if getUserByToken returns null', async () => {
    const { sut, getUserByTokenRepoStub } = makeSUT()
    jest.spyOn(getUserByTokenRepoStub, 'getByToken').mockReturnValueOnce(
      new Promise(resolve => resolve(null))
    )
    
    const user = await sut.getByToken('token', 'role')

    expect(user).toBeNull()
  })

  test('Should return an user on success', async () => {
    const { sut } = makeSUT()

    const user = await sut.getByToken('token', 'role')

    expect(user).toEqual(makeFakeUser())
  })

  test('Should throws if getUserByToken throws', async () => {
    const { sut, getUserByTokenRepoStub } = makeSUT()
    jest.spyOn(getUserByTokenRepoStub, 'getByToken').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )
  
    const promise = sut.getByToken('token', 'role')

    await expect(promise).rejects.toThrow()
  })

  test('Should throws if decrypter throws', async () => {
    const { sut, decrypterStub } = makeSUT()
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )
  
    const promise = sut.getByToken('token', 'role')

    await expect(promise).rejects.toThrow()
  })
})
