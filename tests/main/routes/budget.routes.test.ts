import { FirestoreHelper } from "../../../src/infra/db/firestore/helpers/firestoreHelper"
import request from 'supertest'
import app from "../../../src/main/config/app"

const makeBudget = (): any => ({
  name: 'budget_name',
  total_realized: 42,
  total_projected: 420
})

describe('POST /budget', () => {
  beforeAll(() => {
    FirestoreHelper.connect()
  })
  
  beforeEach(async () => {
    await FirestoreHelper.deleteAll('budgets')
  })

  test('Should return 200 and an budget on add success', async () => {
    await request(app)
      .post('/api/budget')
      .send(makeBudget())
      .expect(200)
  })

  test('Should return 400 if missing params or incorrect params', async () => {
    await request(app)
      .post('/api/budget')
      .send({
        name: 'budget_name',
        total_realized: 42
      })
      .expect(400)

    await request(app)
      .post('/api/budget')
      .send({
        total_projected: 420
      })
      .expect(400)
  })
})