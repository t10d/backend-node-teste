import { UserFirestoreRepo } from "../../../../src/infra/db/firestore/userFirestoreRepo"
import { FirestoreHelper } from "../../../../src/infra/db/firestore/helpers/firestoreHelper"
import { AddUserModel } from "../../../../src/domain/useCases"

interface SUTTypes {
  sut: UserFirestoreRepo
}

const makeSUT = (): SUTTypes => {
  const sut = new UserFirestoreRepo()
  return {
    sut
  }
}

const makeAddUser = (): AddUserModel => ({
  name: 'name',
  email: 'email@email.com',
  password: 'hashed_password'
})

describe('User Repository', () => {
  beforeAll(() => {
    FirestoreHelper.connect()
  })
 
  beforeEach(async () => {
    await FirestoreHelper.deleteAll('users')
  })

  test('Should return an user on add success', async () => {
    const { sut } = makeSUT()

    const user = await sut.add(makeAddUser())

    expect(user).toBeTruthy()
    expect(user.id).toBeTruthy()
    expect(user.name).toBe('name')
    expect(user.email).toBe('email@email.com')
    expect(user.password).toBe('hashed_password')
  })

  test('Should return an user on getByEmail success', async () => {
    const { sut } = makeSUT()
    
    await sut.add(makeAddUser())
    const user = await sut.getByEmail('email@email.com')

    expect(user).toBeTruthy()
    expect(user.id).toBeTruthy()
    expect(user.name).toBe('name')
    expect(user.email).toBe('email@email.com')
    expect(user.password).toBe('hashed_password')
  })

  test('Should return null on getByEmail failure', async () => {
    const { sut } = makeSUT()

    const user = await sut.getByEmail('email@email.com')

    expect(user).toBeNull()
  })

  test('Should update accessToken on updateAccessToken success', async () => {
    const { sut } = makeSUT()
    
    const userAdded = await sut.add(makeAddUser())

    await sut.updateAccessToken(userAdded.id, 'token')
    const userDoc = FirestoreHelper.getCollection('users').doc(userAdded.id)
    const user = (await userDoc.get()).data()

    expect(user).toBeTruthy()
    expect(user.accessToken).toBe('token')
  })
})
