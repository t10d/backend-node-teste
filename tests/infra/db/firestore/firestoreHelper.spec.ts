import { FirestoreHelper as sut } from "../../../../src/infra/helpers/firestoreHelper"

describe('AddUser Repository', () => {
  test('Should connect with call getCollection without connect before', async () => {
    const usersCollection = sut.getCollection('users').doc()
    
    expect(usersCollection).toBeTruthy()
  })
})
