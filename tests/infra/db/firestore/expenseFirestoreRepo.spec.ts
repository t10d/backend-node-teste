import { AddBudgetModel, AddExpenseModel } from "../../../../src/domain/useCases"
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

const makeAddBudget = (): AddBudgetModel => ({
  name: 'budget_name',
  totalRealized: 42,
  totalProjected: 420.42,
  userID: 'user_id'
})

let mockBudget = null

describe('Expense Repository', () => {
  beforeAll(async () => {
    const { budgetSut } = makeSUT()

    FirestoreHelper.connect()
    await FirestoreHelper.deleteAll('expenses')
    await FirestoreHelper.deleteAll('budgets')
    
    mockBudget = (await budgetSut.add(makeAddBudget()))
  })
 
  afterAll(async () => {
    await FirestoreHelper.deleteAll('expenses')
    await FirestoreHelper.deleteAll('budgets')
  })

  test('ExpenseFirestoreRepo.add should add expense as sub collection os budget', async () => {
    const { sut, budgetSut } = makeSUT()

    const expense = await sut.add(makeAddExpense(mockBudget.id))
    const budget = await budgetSut.getById(expense.budgetId)

    expect(budget.expenses).toContainEqual(expense)
  })

  test('Should return an expense on add success', async () => {
    const { sut } = makeSUT()

    const expense = await sut.add(makeAddExpense(mockBudget.id))

    expect(expense).toBeTruthy()
    expect(expense.id).toBeTruthy()
    expect(expense.name).toBe('expense_name')
    expect(expense.realized).toBe(420)
    expect(expense.projected).toBe(500)
    expect(expense.type).toBe('variable')
    expect(expense.budgetId).toBe(mockBudget.id)
  })

  test('Should return an expense on getById success', async () => {
    const { sut } = makeSUT()
    
    const expenseAdded = await sut.add(makeAddExpense(mockBudget.id))
    const expense = await sut.getById(expenseAdded.id)

    expect(expense).toBeTruthy()
    expect(expense.id).toBeTruthy()
    expect(expense.name).toBe('expense_name')
    expect(expense.realized).toBe(420)
    expect(expense.projected).toBe(500)
    expect(expense.type).toBe('variable')
    expect(expense.budgetId).toBe(mockBudget.id)
  })

  test('Should return null on getById failure', async () => {
    const { sut } = makeSUT()

    const expense = await sut.getById('any_not_found_id')

    expect(expense).toBeNull()
  })

  test('Should deleteById an expense successfully and return id', async () => {
    const { sut } = makeSUT()
    
    const expenseAdded = await sut.add(makeAddExpense(mockBudget.id))
    const expenseDeletedId = await sut.deleteById(expenseAdded.id)
    const expense = await sut.getById(expenseDeletedId)

    expect(expenseAdded.id).toEqual(expenseDeletedId)
    expect(expense).toBeFalsy()
  })

  test('Should return null on deleteById failure', async () => {
    const { sut } = makeSUT()

    const expense = await sut.deleteById('no_exists_id')

    expect(expense).toBeNull()
  })

  test('Should return null if not found a budget', async () => {
    const { sut } = makeSUT()

    await FirestoreHelper.deleteCollection('budgets', 100)
    const expense = await sut.add(makeAddExpense(mockBudget.id))

    expect(expense).toBeNull()
  })
})