import { AddBudgetModel, AddExpenseModel, UpdateExpenseModel } from "../../../../src/domain/useCases"
import { BudgetFirestoreRepo } from "../../../../src/infra/db/firestore/budgetFirestoreRepo"
import { ExpenseFirestoreRepo } from "../../../../src/infra/db/firestore/expenseFirestoreRepo"
import { FirestoreHelper } from "../../../../src/infra/helpers/firestoreHelper"

interface SUTTypes {
  sut: ExpenseFirestoreRepo
  budgetSut: BudgetFirestoreRepo
}

const makeSUT = (): SUTTypes => {
  const sut = new ExpenseFirestoreRepo()
  const budgetSut = new BudgetFirestoreRepo()

  return {
    sut,
    budgetSut
  }
}

const makeAddExpense = (budgetId: string): AddExpenseModel => ({
  name: 'expense_name',
  category: 'food',
  realized: 420,
  projected: 500,
  type: 'variable',
  budgetId: budgetId
})

const makeUpdateExpense = (id: string, budgetId: string): UpdateExpenseModel => ({
  id: id,
  name: 'expense_name',
  category: 'food',
  realized: 420,
  projected: 500,
  type: 'variable',
  budgetId: budgetId
})

const makeFakeBudget = (): AddBudgetModel => ({
  name: 'budget_name',
  totalRealized: 42,
  totalProjected: 420.42,
  userId: 'user_id'
})

let budgetAdded = null

describe('Expense Repository', () => {
  beforeAll(async () => {
    const { budgetSut } = makeSUT()

    FirestoreHelper.connect()
    await FirestoreHelper.deleteCollection('expenses', 100)
    await FirestoreHelper.deleteCollection('budgets', 100)

    budgetAdded = await budgetSut.add(makeFakeBudget())
  })
 
  afterAll(async () => {
    await FirestoreHelper.deleteCollection('expenses', 100)
    await FirestoreHelper.deleteCollection('budgets', 100)
  })

  describe('getById', () => {
    test('Should return an expense on getById success', async () => {
      const { sut, budgetSut } = makeSUT()
      
      const expenseAdded = await sut.add(makeAddExpense(budgetAdded.id))
      const expense = await sut.getById(expenseAdded.id, budgetAdded.id)

      expect(expense).toBeTruthy()
      expect(expense.id).toBeTruthy()
      expect(expense.name).toBe('expense_name')
      expect(expense.realized).toBe(420)
      expect(expense.projected).toBe(500)
      expect(expense.type).toBe('variable')
      expect(expense.budgetId).toBe(budgetAdded.id)
    })

    test('Should return null on getById failure', async () => {
      const { sut } = makeSUT()

      const expense = await sut.getById('no_exists_id', 'any_budget_id')

      expect(expense).toBeNull()
    })
  })

  describe('deleteById', () => {
    test('Should deleteById an expense successfully and return id', async () => {
      const { sut, budgetSut } = makeSUT()
      
      const expenseAdded = await sut.add(makeAddExpense(budgetAdded.id))
      const expenseDeletedId = await sut.deleteById(expenseAdded.id, budgetAdded.id)
      const expense = await sut.getById(expenseDeletedId, budgetAdded.id)

      expect(expenseAdded.id).toEqual(expenseDeletedId)
      expect(expense).toBeFalsy()
    })

    test('Should return null on deleteById failure', async () => {
      const { sut } = makeSUT()

      const expense = await sut.deleteById('no_exists_id', 'any_budget_id')

      expect(expense).toBeNull()
    })
  })

  describe('getByBudget', () => {
    test('Should return an empty array of expenses on getByBudget failure', async () => {
      const { sut } = makeSUT()
  
      const expenses = await sut.getByBudget('no_exists_id', 'user_id')
  
      expect(expenses).toEqual([])
    })

    test('Should return an correct array of expenses on getByBudget success', async () => {
      const { sut, budgetSut } = makeSUT()
      
      const expense = await sut.add(makeAddExpense(budgetAdded.id))

      const expenses = await sut.getByBudget(budgetAdded.id, 'user_id')

      expect(expenses).toContainEqual({ ...makeAddExpense(budgetAdded.id), id: expense.id })
    })
  })

  describe('add', () => {
    beforeAll(async () => {
      const { budgetSut } = makeSUT()
  
      budgetAdded = await budgetSut.add(makeFakeBudget())
    })

    afterAll(async () => {
      const { budgetSut } = makeSUT()
  
      budgetSut.deleteById(budgetAdded.id)
    })

    test('ExpenseFirestoreRepo.add should add expense as sub collection of a budget', async () => {
      const { sut, budgetSut } = makeSUT()

      const expense = await sut.add(makeAddExpense(budgetAdded.id))
      const budget = await budgetSut.getById(expense.budgetId)

      expect(budget.expenses).toContainEqual(expense)
    })

    test('Should return an expense on add success', async () => {
      const { sut, budgetSut } = makeSUT()

      const expense = await sut.add(makeAddExpense(budgetAdded.id))

      expect(expense).toBeTruthy()
      expect(expense.id).toBeTruthy()
      expect(expense.name).toBe('expense_name')
      expect(expense.realized).toBe(420)
      expect(expense.projected).toBe(500)
      expect(expense.type).toBe('variable')
      expect(expense.budgetId).toBe(budgetAdded.id)
    })

    test('Should return null if not found a budget', async () => {
      const { sut, budgetSut } = makeSUT()
      
      await FirestoreHelper.deleteCollection('budgets', 100)
      const expense = await sut.add(makeAddExpense(budgetAdded.id))
  
      expect(expense).toBeNull()
    })
  })
  describe('update', () => {
    beforeAll(async () => {
      const { budgetSut } = makeSUT()
  
      budgetAdded = await budgetSut.add(makeFakeBudget())
    })

    afterAll(async () => {
      const { budgetSut } = makeSUT()
  
      budgetSut.deleteById(budgetAdded.id)
    })

    test('Should return an updated expense on success', async () => {
      const { sut, budgetSut } = makeSUT()

      const expenseAdded = await sut.add(makeAddExpense(budgetAdded.id))
      const expense = await sut.update(makeUpdateExpense(expenseAdded.id, budgetAdded.id))

      expect(expense).toBeTruthy()
      expect(expense.id).toBeTruthy()
      expect(expense.name).toBe('expense_name')
      expect(expense.realized).toBe(420)
      expect(expense.projected).toBe(500)
      expect(expense.type).toBe('variable')
      expect(expense.budgetId).toBe(budgetAdded.id)
    })

    test('Should return null if not found a expense', async () => {
      const { sut, budgetSut } = makeSUT()
      
      await FirestoreHelper.deleteCollection(`budget/${budgetAdded.id}/expenses`, 100)
      const expense = await sut.update(makeUpdateExpense('no_exists_id', budgetAdded.id))
  
      expect(expense).toBeNull()
    })
    
    // SHOULD BE LAST TEST
    test('Should return null if not found a budget', async () => {
      const { sut, budgetSut } = makeSUT()
      
      await FirestoreHelper.deleteCollection('budgets', 100)
      const expense = await sut.update(makeUpdateExpense('any_id', budgetAdded.id))
  
      expect(expense).toBeNull()
    })
  })
})