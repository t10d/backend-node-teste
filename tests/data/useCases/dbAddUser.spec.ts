import { AddUserRepository } from "../../../src/data/interfaces/addUserRepository"
import { Encrypter } from "../../../src/data/interfaces/encripter"
import { DbAddUser } from "../../../src/data/useCases/addUser/dbAddUser"
import { UserModel } from "../../../src/domain/models"
import { AddUserModel } from "../../../src/domain/useCases"

interface SUTTypes {
  sut: DbAddUser
  encrypterStub: Encrypter
  addUserRepositoryStub: AddUserRepository
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (password: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }
  return new EncrypterStub()
}

const makeAddUserRepository = (): AddUserRepository => {
  class AddUserRepositoryStub implements AddUserRepository {
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
  return new AddUserRepositoryStub()
}

const makeSUT = (): SUTTypes => {
  const encrypterStub = makeEncrypter()
  const addUserRepositoryStub = makeAddUserRepository()
  const sut = new DbAddUser(encrypterStub, addUserRepositoryStub)

  return {
    sut,
    encrypterStub,
    addUserRepositoryStub
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

  test('Should call AddUserRepository with correct values', async () => {
    const { sut, addUserRepositoryStub } = makeSUT()
    const addUserSpy = jest.spyOn(addUserRepositoryStub, 'add')
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

  test('Should AddUserRepository error to be catched by SignUpController', async () => {
    const { sut, addUserRepositoryStub } = makeSUT()
    jest.spyOn(addUserRepositoryStub, 'add').mockReturnValueOnce(
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

  test('Should AddUserRepository return an user', async () => {
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
