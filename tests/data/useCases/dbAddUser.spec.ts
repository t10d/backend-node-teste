import { AddUserRepo } from "../../../src/data/interfaces/db/auth/addUserRepo"
import { GetUserByEmailRepo } from "../../../src/data/interfaces/db/auth/getUserByEmailRepo"
import { Hasher } from "../../../src/data/interfaces/security/hasher"
import { DbAddUser } from "../../../src/data/useCases/addUser/dbAddUser"
import { UserModel } from "../../../src/domain/models"
import { AddUserModel } from "../../../src/domain/useCases"


const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (password: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }
  return new HasherStub()
}

const makeFakeUser = (): UserModel => ({
  id: 'id',
  name: 'any_name',
  email: 'email@email.com',
  password: 'hashed_password'
})

const makeFakeUserData = (): any => ({
  name: 'any_name',
  email: 'email@email.com',
  password: 'password'
})

const makeAddUserRepository = (): AddUserRepo => {
  class UserRepositoryStub implements AddUserRepo {
    async add (userData: AddUserModel): Promise<UserModel> {
      return new Promise(resolve => resolve(makeFakeUser()))
    }
  }
  return new UserRepositoryStub()
}

const makeGetUserByEmailRepo = (): GetUserByEmailRepo => {
  class GetUserByEmailRepoStub implements GetUserByEmailRepo {
    async getByEmail (email: string): Promise<UserModel> {
      return new Promise(resolve => resolve(null))
    }
  }
  return new GetUserByEmailRepoStub()
}

interface SUTTypes {
  sut: DbAddUser
  hasherStub: Hasher
  addUserRepoStub: AddUserRepo
  getUserByEmailRepoStub: GetUserByEmailRepo
}

const makeSUT = (): SUTTypes => {
  const hasherStub = makeHasher()
  const addUserRepoStub = makeAddUserRepository()
  const getUserByEmailRepoStub = makeGetUserByEmailRepo()
  const sut = new DbAddUser(hasherStub, addUserRepoStub, getUserByEmailRepoStub)

  return {
    sut,
    hasherStub,
    addUserRepoStub,
    getUserByEmailRepoStub
  }
}

describe('DbAddUser UseCase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSUT()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    const userData = makeFakeUserData()

    await sut.add(userData)

    expect(hashSpy).toHaveBeenCalledWith(userData.password)
  })

  test('Should Hasher error to be catched by DbAddUser', async () => {
    const { sut, hasherStub } = makeSUT()
    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )
    const userData = makeFakeUserData()
    const userPromise = sut.add(userData)

    await expect(userPromise).rejects.toThrow()
  })

  test('Should call AddUserRepo with correct values', async () => {
    const { sut, addUserRepoStub } = makeSUT()
    const addUserSpy = jest.spyOn(addUserRepoStub, 'add')
    const userData = makeFakeUserData()

    await sut.add(userData)

    expect(addUserSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'email@email.com',
      password: 'hashed_password'
    })
  })

  test('Should AddUserRepo error to be catched by DbAddUser', async () => {
    const { sut, addUserRepoStub } = makeSUT()
    jest.spyOn(addUserRepoStub, 'add').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )
    const userData = makeFakeUserData()
  
    const userPromise = sut.add(userData)

    await expect(userPromise).rejects.toThrow()
  })

  test('Should AddUserRepo return an user', async () => {
    const { sut } = makeSUT()

    const user = await sut.add(makeFakeUserData())

    console.log(user)

    expect(user).toEqual(makeFakeUser())
  })

  test('Should return null if getUserByEmail doesnt return null', async () => {
    const { sut, getUserByEmailRepoStub } = makeSUT()

    jest.spyOn(getUserByEmailRepoStub, 'getByEmail')
      .mockReturnValueOnce(new Promise(resolve => resolve(makeFakeUser())))
    const user = await sut.add(makeFakeUserData())

    expect(user).toBeNull()
  })

  test('Should call GetUserByEmail with correct email', async () => {
    const { sut, getUserByEmailRepoStub } = makeSUT()
    const getSpy = jest.spyOn(getUserByEmailRepoStub, 'getByEmail')

    await sut.add(makeFakeUserData())

    expect(getSpy).toHaveBeenCalledWith('email@email.com')
  })
})
