import request from 'supertest'
import { FirestoreHelper } from '../../../src/infra/db/firestore/helpers/firestoreHelper'
import app from '../../../src/main/config/app'

describe('POST /signup', () => {
  beforeAll(() => {
    FirestoreHelper.connect()
  })
  
  beforeEach(async () => {
    await FirestoreHelper.deleteAll('users')
  })

  test('Should return 200 and an user on signup success', async () => {
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


describe('POST /auth', () => {
  test('Should return 200 and an user on login success', async () => {
    return
  })
})