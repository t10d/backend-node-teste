import { FirestoreHelper } from "../../../src/infra/helpers/firestoreHelper"
import request from 'supertest'
import app from "../../../src/main/config/app"
import { AddBudgetModel, AddUserModel } from "../../../src/domain/useCases"
import { BudgetFirestoreRepo } from "../../../src/infra/db/firestore/budgetFirestoreRepo"
import { sign } from "jsonwebtoken"
import env from "../../../src/main/config/env"

let mockBudget = null

const makeExpense = (budgetId: string): any => ({
  name: 'expense_name',
  category: 'food',
  realized: 420,
  projected: 500,
  type: 'variable',
  budgetId: budgetId
})

const makeAddBudget = (): AddBudgetModel => ({
  name: 'budget_name',
  totalRealized: 42,
  totalProjected: 420.42,
  userId: 'user_id'
})

const makeAddUser = (): AddUserModel => ({
  name: 'name',
  email: 'email@email.com',
  password: 'hashed_password'
})

let accessToken = null

describe('Expense Routes', () => {
  beforeAll(async () => {
    const budgetSut = new BudgetFirestoreRepo()

    FirestoreHelper.connect()
    await FirestoreHelper.deleteCollection('budgets', 100)
    
    mockBudget = (await budgetSut.add(makeAddBudget()))
  })
  
  afterAll(async () => {
    await FirestoreHelper.deleteCollection('budgets', 100)
    await FirestoreHelper.deleteCollection('users', 100)
  })

  describe('POST /expense', () => {
    describe('without accessToken', () => {
      test('Should return 403 without accessToken', async () => {
        await request(app)
          .post('/api/expense')
          .send(makeExpense(mockBudget.id))
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
      })

      test('Should return 200 and an expense on add success', async () => {
        await request(app)
          .post('/api/expense')
          .set('x-access-token', accessToken)
          .send(makeExpense(mockBudget.id))
          .expect(200)
      })
    
      test('Should return 400 if missing params or incorrect params', async () => {
        const fakeExpense = makeExpense(mockBudget.id)
    
        for (const key in makeExpense(mockBudget.id)) {
          const newFakeExpense = Object.assign({}, fakeExpense)
          delete newFakeExpense[key]
    
          await request(app)
            .post('/api/expense')
            .set('x-access-token', accessToken)
            .send(newFakeExpense)
            .expect(400)
        }
      })
    })
  })

  describe('PUT /expense/:id', () => {
    describe('without accessToken', () => {
      test('Should return 403 without accessToken', async () => {
        await request(app)
          .put('/api/expense/fake-id')
          .send(makeExpense(mockBudget.id))
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
        await FirestoreHelper.getCollection(`budgets/${mockBudget.id}/expenses`).doc('fake-id').set(makeExpense(mockBudget.id))
      })

      test('Should return 200 and an expense on add success', async () => {
        await request(app)
          .put('/api/expense/fake-id')
          .set('x-access-token', accessToken)
          .send(makeExpense(mockBudget.id))
          .expect(200)
      })
    
      test('Should return 400 if missing params or incorrect params', async () => {
        const fakeExpense = makeExpense(mockBudget.id)
        
        delete fakeExpense['budgetId']

        console.log(fakeExpense)
        await request(app)
          .put('/api/expense/fake-id')
          .set('x-access-token', accessToken)
          .send(fakeExpense)
          .expect(400)
      })
    })
  })

  // describe('GET /expenses', () => {
  //   describe('without accessToken', () => {
  //     test('Should return 403 without accessToken', async () => {
  //       await request(app)
  //         .get('/expenses')
  //         .query({ budgetId: 'budget_id' })
  //         .expect(403)
  //     })
  //   })

  //   describe('with accessToken', () => {
  //     beforeAll(async () => {
  //       await FirestoreHelper.deleteCollection('users', 100)
  //       const userDoc = FirestoreHelper.getCollection('users').doc()
  //       accessToken = sign({ id: userDoc.id }, env.jwtSecret)
  //       const userObject = { 
  //         id: userDoc.id, 
  //         ...makeAddUser(), 
  //         role: 'user',
  //         accessToken: accessToken
  //       }
  //       await userDoc.set(userObject)
  //     })

  //     test('Should return 200 and an expense on add success', async () => {
  //       await request(app)
  //         .get('/expenses')
  //         .query({ budgetId: 'budget_id' })
  //         .set('x-access-token', accessToken)
  //         .expect(200)
  //     })
  //   })
  // })
})