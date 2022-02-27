import { AddUserRepo } from "../../../src/data/interfaces/db/addUserRepo"
import { Encrypter } from "../../../src/data/interfaces/security/encripter"
import { DbAddUser } from "../../../src/data/useCases/addUser/dbAddUser"
import { UserModel } from "../../../src/domain/models"
import { AddUserModel } from "../../../src/domain/useCases"

interface SUTTypes {
  sut: DbAddUser
  encrypterStub: Encrypter
  addUserRepoStub: AddUserRepo
}

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
  name: 'any_name',
  email: 'email@email.com',
  password: 'password'
})

const makeAddUserRepository = (): AddUserRepo => {
  class UserRepositoryStub implements AddUserRepo {
    async add (userData: AddUserModel): Promise<UserModel> {
      const fakeUser = makeFakeUser()
      return new Promise(resolve => resolve(fakeUser))
    }
  }
  return new UserRepositoryStub()
}

const makeSUT = (): SUTTypes => {
  const encrypterStub = makeEncrypter()
  const addUserRepoStub = makeAddUserRepository()
  const sut = new DbAddUser(encrypterStub, addUserRepoStub)

  return {
    sut,
    encrypterStub,
    addUserRepoStub
  }
}

describe('DbAddUser UseCase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSUT()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const userData = makeFakeUserData()

    await sut.add(userData)

    expect(encryptSpy).toHaveBeenCalledWith(userData.password)
  })

  test('Should Encrypter error to be catched by SignUpController', async () => {
    const { sut, encrypterStub } = makeSUT()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(
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

  test('Should AddUserRepo error to be catched by SignUpController', async () => {
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
    const userData = makeFakeUserData()

    const user = await sut.add(userData)

    expect(user).toEqual(makeFakeUser())
  })
})
