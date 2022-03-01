import { AddBudgetModel } from "../../../../src/domain/useCases"
import { BudgetFirestoreRepo } from "../../../../src/infra/db/firestore/budgetFirestoreRepo"
import { FirestoreHelper } from "../../../../src/infra/helpers/firestoreHelper"

interface SUTTypes {
  sut: BudgetFirestoreRepo
}

const makeSUT = (): SUTTypes => {
  const sut = new BudgetFirestoreRepo()
  return {
    sut
  }
}

const makeAddBudget = (): AddBudgetModel => ({
  name: 'budget_name',
  totalRealized: 42,
  totalProjected: 420.42
})

describe('Budget Repository', () => {
  beforeAll(() => {
    FirestoreHelper.connect()
  })
 
  beforeEach(async () => {
    await FirestoreHelper.deleteAll('budgets')
  })
  describe('add', () => {
    test('Should return a budget on add success', async () => {
      const { sut } = makeSUT()

      const budget = await sut.add(makeAddBudget())

      expect(budget).toBeTruthy()
      expect(budget.id).toBeTruthy()
      expect(budget.name).toBe('budget_name')
      expect(budget.totalRealized).toBe(42)
      expect(budget.totalProjected).toBe(420.42)
    })
  })
  describe('getById', () => {
    test('Should return a budget on getById success', async () => {
      const { sut } = makeSUT()
      
      const budgetAdded = await sut.add(makeAddBudget())
      const budget = await sut.getById(budgetAdded.id)

      expect(budget).toBeTruthy()
      expect(budget.id).toBeTruthy()
      expect(budget.name).toBe('budget_name')
      expect(budget.totalRealized).toBe(42)
      expect(budget.totalProjected).toBe(420.42)
    })

    test('Should return null on getById failure', async () => {
      const { sut } = makeSUT()

      const budget = await sut.getById('any_not_found_id')

      expect(budget).toBeNull()
    })
  })
  describe('deleteById', () => {
    test('Should deleteById returns a budget successfully and return id', async () => {
      const { sut } = makeSUT()
      
      const budgetAdded = await sut.add(makeAddBudget())
      const budgetDeletedId = await sut.deleteById(budgetAdded.id)
      const budget = await sut.getById(budgetDeletedId)

      expect(budgetAdded.id).toEqual(budgetDeletedId)
      expect(budget).toBeFalsy()
    })

    test('Should return null on deleteById failure', async () => {
      const { sut } = makeSUT()

      const budget = await sut.deleteById('no_exists_id')

      expect(budget).toBeNull()
    })
  })
})