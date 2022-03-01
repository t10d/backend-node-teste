import { FirestoreHelper } from "../../../src/infra/helpers/firestoreHelper"
import request from 'supertest'
import app from "../../../src/main/config/app"
import { AddUserModel } from "../../../src/domain/useCases"
import { sign } from 'jsonwebtoken'
import env from "../../../src/main/config/env"

const makeBudget = (): any => ({
  name: 'budget_name',
  totalRealized: 42,
  totalProjected: 420
})

const makeAddUser = (): AddUserModel => ({
  name: 'name',
  email: 'email@email.com',
  password: 'hashed_password'
})

let accessToken = null

describe('Budget Routes', () => {
  afterAll(async () => {
    await FirestoreHelper.deleteAll('users')
  })

  describe('POST /budget', () => {
    beforeAll(() => {
      FirestoreHelper.connect()
    })
    
    beforeEach(async () => {
      await FirestoreHelper.deleteAll('budgets')
    })

    describe('without accessToken', () => {
      test('Should return 403 and an budget on add success without accessToken', async () => {
        await request(app)
          .post('/api/budget')
          .send(makeBudget())
          .expect(403)
      })
    })

    describe('with accessToken', () => {
      beforeAll(async () => {
        const userDoc = FirestoreHelper.getCollection('users').doc()
        accessToken = sign({ id: userDoc.id }, env.jwtSecret)
        const userObject = { 
          id: userDoc.id, 
          ...makeAddUser(), 
          role: 'user',
          accessToken: accessToken
        }
        await userDoc.set(userObject)
      })

      test('Should return 200 and an budget on add success', async () => {
        await request(app)
          .post('/api/budget')
          .set('x-access-token', accessToken)
          .send(makeBudget())
          .expect(200)
      }) 

      test('Should return 400 if missing params or incorrect params', async () => {
          const fakeBudget = makeBudget()

          for (const key in makeBudget()) {
            const newFakeBudget = Object.assign({}, fakeBudget)
            delete newFakeBudget[key]
      
            await request(app)
              .post('/api/budget')
              .set('x-access-token', accessToken)
              .send(newFakeBudget)
              .expect(400)
          }
      })
    })
  })

  describe('DELETE /budget', () => {
    beforeAll(() => {
      FirestoreHelper.connect()
    })
    
    beforeEach(async () => {
      await FirestoreHelper.deleteAll('budgets')
    })

    describe('without accessToken', () => {
      test('Should return 403 and an budget on add success without accessToken', async () => {
        await request(app)
          .delete('/api/budget/budget_id')
          .expect(403)
      })
    })

    describe('with accessToken', () => {
      beforeAll(async () => {
        const userDoc = FirestoreHelper.getCollection('users').doc()
        accessToken = sign({ id: userDoc.id }, env.jwtSecret)
        const userObject = { 
          id: userDoc.id, 
          ...makeAddUser(), 
          role: 'user',
          accessToken: accessToken
        }
        await userDoc.set(userObject)
      })

      test('Should return 200 and an budget on delete success', async () => {
        await request(app)
          .delete('/api/budget/budget_id')
          .set('x-access-token', accessToken)
          .expect(200)
      })

      test('Should return 404 if missing params or incorrect params', async () => {
        await request(app)
          .delete('/api/budget')
          .set('x-access-token', accessToken)
          .expect(404)
      })
    })
  })
})