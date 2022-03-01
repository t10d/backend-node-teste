import { FirestoreHelper } from "../../../src/infra/helpers/firestoreHelper"
import request from 'supertest'
import app from "../../../src/main/config/app"
import { AddBudgetModel } from "../../../src/domain/useCases"
import { BudgetFirestoreRepo } from "../../../src/infra/db/firestore/budgetFirestoreRepo"

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
  userID: 'user_id'
})

describe('POST /expense', () => {
  beforeAll(async () => {
    const budgetSut = new BudgetFirestoreRepo()

    FirestoreHelper.connect()
    await FirestoreHelper.deleteAll('expenses')
    await FirestoreHelper.deleteAll('budgets')
    
    mockBudget = (await budgetSut.add(makeAddBudget()))
  })
  
  afterAll(async () => {
    // await FirestoreHelper.deleteAll('expenses')
    // await FirestoreHelper.deleteCollection('budgets', 100)
  })

  test('Should return 200 and an expense on add success', async () => {
    await request(app)
      .post('/api/expense')
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
        .send(newFakeExpense)
        .expect(400)
    }
  })
})