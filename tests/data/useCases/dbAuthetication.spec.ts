import { UserModel } from "../../../src/domain/models"
import { GetUserByEmailRepo } from "../../../src/data/interfaces/db/auth/getUserByEmailRepo"
import { DbAuthentication } from "../../../src/data/useCases/authentication/dbAuthentication"
import { HashComparer } from "../../../src/data/interfaces/security/hashComparer"
import { TokenGenerator } from "../../../src/data/interfaces/security/tokenGenerator"
import { UpdateAccessTokenRepo } from "../../../src/data/interfaces/db/auth/updateAcessTokenRepo"
import { Encrypter } from "../../../src/data/interfaces/security/Encrypter"

const makeFakeUser = (): UserModel => ({
  id: 'id',
  name: 'any_name',
  email: 'email@email.com',
  password: 'hashed_password'
})

const makeFakeUserData = (): any => ({
  email: 'email@email.com',
  password: 'password'
})

const makeGetUserByEmailRepo = (): GetUserByEmailRepo => {
  class GetUserByEmailRepoStub implements GetUserByEmailRepo {
    async getByEmail (email: string): Promise<UserModel> {
      const user: UserModel = makeFakeUser()
      return new Promise(resolve => resolve(user))
    }
  }
  return new GetUserByEmailRepoStub()
}


const makeHashCompareStub = (): HashComparer => {
  class HashCompareStub implements HashComparer {
    async compare (value: string, hash: string): Promise<boolean> {
      return new Promise(resolve => resolve(true))
    }
  }
  return new HashCompareStub()
}

const makeTokenGeneratorStub = (): Encrypter => {
  class TokenGeneratorStub implements Encrypter {
    async encrypt (id: string): Promise<string> {
      return new Promise(resolve => resolve('token'))
    }
  }
  return new TokenGeneratorStub()
}

const makeUpdateAccessTokenRepoStub = (): UpdateAccessTokenRepo => {
  class UpdateAccessTokenRepoStub implements UpdateAccessTokenRepo {
    async updateAccessToken (id: string, token: string): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new UpdateAccessTokenRepoStub()
}

interface SUTTypes {
  sut: DbAuthentication
  hashCompareStub: HashComparer
  getUserByEmailRepoStub: GetUserByEmailRepo
  tokenGeneratorStub: Encrypter
  updateAccessTokenRepoStub: UpdateAccessTokenRepo
}

const makeSUT = (): SUTTypes => {
  const hashCompareStub = makeHashCompareStub()
  const getUserByEmailRepoStub = makeGetUserByEmailRepo()
  const tokenGeneratorStub = makeTokenGeneratorStub()
  const updateAccessTokenRepoStub = makeUpdateAccessTokenRepoStub()
  const sut = new DbAuthentication(
    getUserByEmailRepoStub, 
    hashCompareStub, 
    tokenGeneratorStub,
    updateAccessTokenRepoStub
  )

  return {
    sut,
    hashCompareStub,
    getUserByEmailRepoStub,
    tokenGeneratorStub,
    updateAccessTokenRepoStub
  }
}

describe('DbAuth UseCase', () => {
  test('Should call GetUserByEmail with correct email', async () => {
    const { sut, getUserByEmailRepoStub } = makeSUT()
    const getSpy = jest.spyOn(getUserByEmailRepoStub, 'getByEmail')

    await sut.auth(makeFakeUserData()) 

    expect(getSpy).toHaveBeenCalledWith('email@email.com')
  })

  test('Should throw if GetUserByEmailRepo throw an error', async () => {
    const { sut, getUserByEmailRepoStub } = makeSUT()
    jest.spyOn(getUserByEmailRepoStub, 'getByEmail')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const accessTokenPromise = sut.auth(makeFakeUserData()) 

    await expect(accessTokenPromise).rejects.toThrow()
  })

  test('Should return null if getUserByEmailRepo return null', async () => {
    const { sut, getUserByEmailRepoStub } = makeSUT()
    jest.spyOn(getUserByEmailRepoStub, 'getByEmail').mockReturnValueOnce(null)

    const accessToken = await sut.auth(makeFakeUserData()) 

    expect(accessToken).toBeNull()
  })

  test('Should call HashComparer with correct passwords', async () => {
    const { sut, hashCompareStub } = makeSUT()
    const compareSpy = jest.spyOn(hashCompareStub, 'compare')

    await sut.auth(makeFakeUserData()) 

    expect(compareSpy).toHaveBeenCalledWith('password', 'hashed_password')
  })

  test('Should throw if HashComparer throw an error', async () => {
    const { sut, hashCompareStub } = makeSUT()
    jest.spyOn(hashCompareStub, 'compare')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const accessTokenPromise = sut.auth(makeFakeUserData()) 

    await expect(accessTokenPromise).rejects.toThrow()
  })

  test('Should return null if HashComparer return false', async () => {
    const { sut, hashCompareStub } = makeSUT()
    jest.spyOn(hashCompareStub, 'compare')
      .mockReturnValueOnce(new Promise(resolve => resolve(false)))

    const accessToken = await sut.auth(makeFakeUserData()) 

    expect(accessToken).toBeNull()
  })

  test('Should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSUT()
    const encryptSpy = jest.spyOn(tokenGeneratorStub, 'encrypt')

    await sut.auth(makeFakeUserData()) 

    expect(encryptSpy).toHaveBeenCalledWith('id')
  })

  test('Should throw if TokenGenerator throw an error', async () => {
    const { sut, tokenGeneratorStub } = makeSUT()
    jest.spyOn(tokenGeneratorStub, 'encrypt')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const accessTokenPromise = sut.auth(makeFakeUserData()) 

    await expect(accessTokenPromise).rejects.toThrow()
  })

  test('Should return correct accessToken if TokenGenerator returns with succes', async () => {
    const { sut } = makeSUT()

    const accessToken = await sut.auth(makeFakeUserData()) 

    expect(accessToken).toBe('token')
  })

  test('Should call UpdateAccessTokenRepo with correct values', async () => {
    const { sut, updateAccessTokenRepoStub } = makeSUT()
    const updateSpy = jest.spyOn(updateAccessTokenRepoStub, 'updateAccessToken')

    await sut.auth(makeFakeUserData()) 

    expect(updateSpy).toHaveBeenCalledWith('id', 'token')
  })

  test('Should throw if UpdateAccessTokenRepo throw an error', async () => {
    const { sut, updateAccessTokenRepoStub } = makeSUT()
    jest.spyOn(updateAccessTokenRepoStub, 'updateAccessToken')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const accessTokenPromise = sut.auth(makeFakeUserData()) 

    await expect(accessTokenPromise).rejects.toThrow()
  })
})