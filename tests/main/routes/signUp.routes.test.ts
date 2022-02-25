import request from 'supertest'
import { FirestoreHelper } from '../../../src/infra/db/firestore/helpers/firestoreHelper'
import app from '../../../src/main/config/app'

describe('SignUp Router', () => {
  beforeAll(() => {
    FirestoreHelper.connect()
  })
  
  beforeEach(async () => {
    await FirestoreHelper.deleteAll('users')
  })

  test('Should return an user on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'name',
        email: 'email@email.com',
        password: 'password',
        passwordConfirmation: 'password'
      })
      .expect(200)
  })
})