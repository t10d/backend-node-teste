import { Encrypter } from "../../../src/data/interfaces/encripter"
import { AddUserRepo } from "../../../src/data/interfaces/addUserRepo"
import { UserModel } from "../../../src/domain/models"
import { LoadUserByEmailRepo } from "../../../src/data/interfaces/loadUserByEmailRepo"
import { DbAuthentication } from "../../../src/data/useCases/authentication/dbAuthentication"

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (password: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }
  return new EncrypterStub()
}

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

interface SUTTypes {
  sut: DbAuthentication
  encrypterStub: Encrypter
  loadUserByEmailRepoStub: LoadUserByEmailRepo
}

const makeSUT = (): SUTTypes => {
  const encrypterStub = makeEncrypter()
  const loadUserByEmailRepoStub = makeLoadUserByEmailRepo()
  const sut = new DbAuthentication(loadUserByEmailRepoStub)

  return {
    sut,
    encrypterStub,
    loadUserByEmailRepoStub
  }
}

describe('DbAuth UseCase', () => {
  test('Should DbAuth call LoadUserByEmail with correct email', async () => {
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
})