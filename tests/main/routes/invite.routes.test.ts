import { AddInviteModel, AddUserModel } from "../../../src/domain/useCases"
import { FirestoreHelper } from "../../../src/infra/helpers/firestoreHelper"
import request from 'supertest'
import env from "../../../src/main/config/env"
import app from "../../../src/main/config/app"
import { sign } from "jsonwebtoken"

const makeInvite = (date: Date): AddInviteModel => ({
  description: 'invite_desc',
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
    await FirestoreHelper.deleteCollection('users', 100)
  })

  describe('POST /invite', () => {
    beforeAll(() => {
      FirestoreHelper.connect()
    })
    
    afterAll(async () => {
      await FirestoreHelper.deleteCollection('invites', 100)
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
        await FirestoreHelper.deleteCollection('users', 100)
        const userDoc = FirestoreHelper.getCollection('users').doc()
        accessToken = sign({ id: userDoc.id }, env.jwtSecret)
        const userObject = { 
          id: userDoc.id, 
          ...makeAddUser(), 
          role: 'user',
          accessToken: accessToken
        }
        await userDoc.set(userObject)

        await FirestoreHelper.getCollection('users').doc('to_user_id').set(makeAddUser())
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

  describe('DELETE /invite/:id', () => {
    beforeAll(() => {
      FirestoreHelper.connect()
    })
    
    afterAll(async () => {
      await FirestoreHelper.deleteCollection('invites', 100)
    })

    describe('without accessToken', () => {
      test('Should return 403 and an invite delete without accessToken', async () => {
        await request(app)
          .delete('/api/invite/invite_id')
          .send()
          .expect(403)
      })
    })

    describe('with accessToken', () => {
      beforeAll(async () => {
        await FirestoreHelper.deleteCollection('users', 100)
        const userDoc = FirestoreHelper.getCollection('users').doc()
        accessToken = sign({ id: userDoc.id }, env.jwtSecret)
        const userObject = { 
          id: userDoc.id, 
          ...makeAddUser(), 
          role: 'user',
          accessToken: accessToken
        }
        await userDoc.set(userObject)
        await FirestoreHelper.getCollection('invites').doc('invite_id').set(makeInvite(date))
      })

      test('Should return 200 and an invite on delete success', async () => {
        await request(app)
          .delete('/api/invite/invite_id')
          .set('x-access-token', accessToken)
          .send()
          .expect(200)
      }) 

      test('Should return 404 if missing id', async () => {
        await request(app)
          .delete('/api/invite')
          .set('x-access-token', accessToken)
          .send()
          .expect(404)
      })
    })
  })

  describe('PATCH /invite_status/:id', () => {
    beforeAll(() => {
      FirestoreHelper.connect()
    })
    
    afterAll(async () => {
      await FirestoreHelper.deleteCollection('invites', 100)
    })

    describe('without accessToken', () => {
      test('Should return 403 and an invite status update without accessToken', async () => {
        await request(app)
          .patch('/api/invite_status/invite_id')
          .send()
          .expect(403)
      })
    })

    describe('with accessToken', () => {
      beforeAll(async () => {
        await FirestoreHelper.deleteCollection('users', 100)
        const userDoc = FirestoreHelper.getCollection('users').doc()
        accessToken = sign({ id: userDoc.id }, env.jwtSecret)
        const userObject = { 
          id: userDoc.id, 
          ...makeAddUser(), 
          role: 'user',
          accessToken: accessToken
        }
        await userDoc.set(userObject)
        await FirestoreHelper.getCollection('invites').doc('invite_id').set(makeInvite(date))
      })

      test('Should return 200 and an invite on status update success', async () => {
        await request(app)
          .patch('/api/invite_status/invite_id')
          .set('x-access-token', accessToken)
          .send({
            status: 'any_status'
          })
          .expect(200)
      })

      test('Should return 404 if missing id', async () => {
        await request(app)
          .patch('/api/invite_status')
          .set('x-access-token', accessToken)
          .send()
          .expect(404)
      })
    })
  })
})