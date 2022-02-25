import { AddUserRepository } from "../../../src/data/interfaces/addUserRepo"
import { UserFirestoreRepo } from "../../../src/infra/db/firestore/userFirestoreRepo"
import { FirestoreHelper } from "../../../src/infra/db/firestore/helpers/firestoreHelper"
interface SUTTypes {
  sut: AddUserRepository
}

const makeSUT = (): SUTTypes => {
  const sut = new UserFirestoreRepo()
  return {
    sut
  }
}

describe('AddUser Repository', () => {
  beforeAll(() => {
    FirestoreHelper.connect()
  })

  beforeEach(async () => {
    await FirestoreHelper.deleteAll('users')
  })

  test('Should return an user on success', async () => {
    const { sut } = makeSUT()

    const user = await sut.add({
      name: 'name',
      email: 'email@email.com',
      password: 'hashed_password'
    })

    expect(user).toBeTruthy()
    expect(user.id).toBeTruthy()
    expect(user.name).toBe('name')
    expect(user.email).toBe('email@email.com')
    expect(user.password).toBe('hashed_password')
  })
})
