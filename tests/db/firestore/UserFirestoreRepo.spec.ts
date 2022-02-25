import { UserRepository } from "../../../src/data/interfaces/userRepo"
import { UserFirestoreRepo } from "../../../src/infra/db/firestore/userFirestoreRepo"
import { FirestoreHelper } from "../../../src/infra/db/firestore/helpers/firestoreHelper"
import { UserModel } from "../../../src/domain/models"
interface SUTTypes {
  sut: UserRepository
}

const makeSUT = (): SUTTypes => {
  const sut = new UserFirestoreRepo()
  return {
    sut
  }
}

describe('User Repository', () => {
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
