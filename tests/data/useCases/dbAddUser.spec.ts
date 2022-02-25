import { UserRepository } from "../../../src/data/interfaces/userRepo"
import { Encrypter } from "../../../src/data/interfaces/encripter"
import { DbAddUser } from "../../../src/data/useCases/addUser/dbAddUser"
import { UserModel } from "../../../src/domain/models"
import { AddUserModel } from "../../../src/domain/useCases"

interface SUTTypes {
  sut: DbAddUser
  encrypterStub: Encrypter
  userRepositoryStub: UserRepository
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (password: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }
  return new EncrypterStub()
}

const makeAddUserRepository = (): UserRepository => {
  class UserRepositoryStub implements UserRepository {
    async add (userData: AddUserModel): Promise<UserModel> {
      const fakeUser = {
        id: 'id',
        name: 'any_name',
        email: 'email@email.com',
        password: 'hashed_password'
      }
      return new Promise(resolve => resolve(fakeUser))
    }
  }
  return new UserRepositoryStub()
}

const makeSUT = (): SUTTypes => {
  const encrypterStub = makeEncrypter()
  const userRepositoryStub = makeAddUserRepository()
  const sut = new DbAddUser(encrypterStub, userRepositoryStub)

  return {
    sut,
    encrypterStub,
    userRepositoryStub
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

  test('Should Encrypter error to be catched by SignUpController', async () => {
    const { sut, encrypterStub } = makeSUT()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )
    const userData = {
      name: 'any_name',
      email: 'email@email.com',
      password: 'any_password'
    }

    const userPromise = sut.add(userData)

    await expect(userPromise).rejects.toThrow()
  })

  test('Should call UserRepository with correct values', async () => {
    const { sut, userRepositoryStub } = makeSUT()
    const addUserSpy = jest.spyOn(userRepositoryStub, 'add')
    const userData = {
      name: 'any_name',
      email: 'email@email.com',
      password: 'any_password'
    }

    await sut.add(userData)

    expect(addUserSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'email@email.com',
      password: 'hashed_password'
    })
  })

  test('Should UserRepository error to be catched by SignUpController', async () => {
    const { sut, userRepositoryStub } = makeSUT()
    jest.spyOn(userRepositoryStub, 'add').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )
    const userData = {
      name: 'any_name',
      email: 'email@email.com',
      password: 'any_password'
    }

    const userPromise = sut.add(userData)

    await expect(userPromise).rejects.toThrow()
  })

  test('Should UserRepository return an user', async () => {
    const { sut } = makeSUT()

    const userData = {
      name: 'any_name',
      email: 'email@email.com',
      password: 'any_password'
    }

    const user = await sut.add(userData)

    await expect(user).toEqual({
      id: 'id',
      name: 'any_name',
      email: 'email@email.com',
      password: 'hashed_password'
    })
  })
})
