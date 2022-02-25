import request from 'supertest'
import app from '../../../src/main/config/app'

describe('SignUp Router', () => {
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