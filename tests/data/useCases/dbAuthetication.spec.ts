import { UserModel } from "../../../src/domain/models"
import { LoadUserByEmailRepo } from "../../../src/data/interfaces/loadUserByEmailRepo"
import { DbAuthentication } from "../../../src/data/useCases/authentication/dbAuthentication"
import { HashComparer } from "../../../src/data/interfaces/security/hashComparer"

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

const makeLoadUserByEmailRepo = (): LoadUserByEmailRepo => {
  class LoadUserByEmailRepoStub implements LoadUserByEmailRepo {
    async load (email: string): Promise<UserModel> {
      const user: UserModel = makeFakeUser()
      return new Promise(resolve => resolve(user))
    }
  }
  return new LoadUserByEmailRepoStub()
}


const makeHashCompareStub = (): HashComparer => {
  class HashCompareStub implements HashComparer {
    async compare (value: string, hash: string): Promise<boolean> {
      return new Promise(resolve => resolve(true))
    }
  }
  return new HashCompareStub()
}

interface SUTTypes {
  sut: DbAuthentication
  hashCompareStub: HashComparer
  loadUserByEmailRepoStub: LoadUserByEmailRepo
}

const makeSUT = (): SUTTypes => {
  const hashCompareStub = makeHashCompareStub()
  const loadUserByEmailRepoStub = makeLoadUserByEmailRepo()
  const sut = new DbAuthentication(loadUserByEmailRepoStub, hashCompareStub)

  return {
    sut,
    hashCompareStub,
    loadUserByEmailRepoStub
  }
}

describe('DbAuth UseCase', () => {
  test('Should call LoadUserByEmail with correct email', async () => {
    const { sut, loadUserByEmailRepoStub } = makeSUT()
    const getSpy = jest.spyOn(loadUserByEmailRepoStub, 'load')

    await sut.auth(makeFakeUserData()) 

    expect(getSpy).toHaveBeenCalledWith('email@email.com')
  })

  test('Should throw if LoadUserByEmailRepo throw an error', async () => {
    const { sut, loadUserByEmailRepoStub } = makeSUT()
    jest.spyOn(loadUserByEmailRepoStub, 'load')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const accessTokenPromise = sut.auth(makeFakeUserData()) 

    await expect(accessTokenPromise).rejects.toThrow()
  })

  test('Should return null if loadUserByEmailRepo return null', async () => {
    const { sut, loadUserByEmailRepoStub } = makeSUT()
    jest.spyOn(loadUserByEmailRepoStub, 'load').mockReturnValueOnce(null)

    const accessToken = await sut.auth(makeFakeUserData()) 

    expect(accessToken).toBeNull()
  })

  test('Should call HashComparer with correct password', async () => {
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

  test('Should return null if loadUserByEmailRepo return false', async () => {
    const { sut, hashCompareStub } = makeSUT()
    jest.spyOn(hashCompareStub, 'compare')
      .mockReturnValueOnce(new Promise(resolve => resolve(false)))

    const accessToken = await sut.auth(makeFakeUserData()) 

    expect(accessToken).toBeNull()
  })
})