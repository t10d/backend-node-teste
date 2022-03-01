import { AddInviteModel, AddUserModel } from "../../../src/domain/useCases"
import { FirestoreHelper } from "../../../src/infra/helpers/firestoreHelper"
import request from 'supertest'
import env from "../../../src/main/config/env"
import app from "../../../src/main/config/app"
import { sign } from "jsonwebtoken"

const makeInvite = (date: Date): AddInviteModel => ({
  description: 'invite_desc',
  from: 'from_user_id',
  to: 'to_user_id',
  date: date,
  budgetId: 'budget_id'
})

const makeAddUser = (): AddUserModel => ({
  name: 'name',
  email: 'email@email.com',
  password: 'hashed_password'
})

let accessToken = null
const date = new Date()

describe('Invite Routes', () => {
  afterAll(async () => {
    await FirestoreHelper.deleteAll('users')
  })

  describe('POST /invite', () => {
    beforeAll(() => {
      FirestoreHelper.connect()
    })
    
    beforeEach(async () => {
      await FirestoreHelper.deleteAll('invites')
    })

    describe('without accessToken', () => {
      test('Should return 403 and an invite on add success without accessToken', async () => {
        await request(app)
          .post('/api/invite')
          .send(makeInvite(date))
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

      test('Should return 200 and an invite on add success', async () => {
        await request(app)
          .post('/api/invite')
          .set('x-access-token', accessToken)
          .send(makeInvite(date))
          .expect(200)
      }) 

      test('Should return 400 if missing params or incorrect params', async () => {
          const fakeInvite = makeInvite(date)
          delete fakeInvite.description
          delete fakeInvite.from

          for (const key in makeInvite(date)) {
            const newFakeInvite = Object.assign({}, fakeInvite)
            delete newFakeInvite[key]
      
            await request(app)
              .post('/api/invite')
              .set('x-access-token', accessToken)
              .send(newFakeInvite)
              .expect(400)
          }
      })
    })
  })
})