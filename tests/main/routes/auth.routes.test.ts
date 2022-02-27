import request from 'supertest'
import { FirestoreHelper } from '../../../src/infra/db/firestore/helpers/firestoreHelper'
import { UserFirestoreRepo } from '../../../src/infra/db/firestore/userFirestoreRepo'
import app from '../../../src/main/config/app'
import { hash } from 'bcrypt'

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

  test('Should return 400 if missing params or incorrect params', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'name',
        password: 'password',
        passwordConfirmation: 'password'
      })
      .expect(400)

    await request(app)
      .post('/api/signup')
      .send({
        name: 'name',
        email: 'email@email.com',
        passwordConfirmation: 'password'
      })
      .expect(400)

    await request(app)
      .post('/api/signup')
      .send({
        name: 'name',
        email: 'email@email.com',
        password: 'password',
        passwordConfirmation: 'diff_password'
      })
      .expect(400)
  })
})

const makeUserData = async (): Promise<any> => ({
  name: 'name',
  email: 'email@email.com',
  password: await hash('password', 12),
})

describe('POST /auth', () => {
  beforeAll(() => {
    FirestoreHelper.connect()
  })
  
  beforeEach(async () => {
    await FirestoreHelper.deleteAll('users')
  })

  test('Should return 200 and an user on login success', async () => {
    const userFirestoreRepo = new UserFirestoreRepo()
    userFirestoreRepo.add(await makeUserData())
    
    await request(app)
      .post('/api/auth')
      .send({
        email: 'email@email.com',
        password: 'password',
      })
      .expect(200)
  })

  test('Should return 401 if user doesnt exist', async () => {
    await request(app)
      .post('/api/auth')
      .send({
        email: 'email@email.com',
        password: 'password',
      })
      .expect(401)
  })
})