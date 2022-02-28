import { AddExpenseRepo } from "../../../src/data/interfaces/db/expense/addExpenseRepo"
import { DbAddExpense } from "../../../src/data/useCases/expense/dbAddExpense"
import { ExpenseModel } from "../../../src/domain/models"
import { AddExpenseModel } from "../../../src/domain/useCases"

const makeFakeExpenseData = (): AddExpenseModel => ({
  name: 'expense_name',
  category: 'food',
  realized: 420,
  projected: 500,
  type: 'variable',
  budgetId: 'budget_id'
})

const makeFakeExpense = (): ExpenseModel => ({
  id: 'id',
  name: 'expense_name',
  category: 'food',
  realized: 420,
  projected: 500,
  type: 'variable',
  budgetId: 'budget_id'
})

const makeAddExpenseRepoStub = (): AddExpenseRepo => {
  class ExpenseRepositoryStub implements AddExpenseRepo {
    async add (expenseData: AddExpenseModel): Promise<ExpenseModel> {
      const fakeExpense = makeFakeExpense()
      return new Promise(resolve => resolve(fakeExpense))
    }
  }
  return new ExpenseRepositoryStub()
}

interface SUTTypes {
  sut: DbAddExpense
  addExpenseRepoStub: AddExpenseRepo
}

const makeSUT = (): SUTTypes => {
  const addExpenseRepoStub = makeAddExpenseRepoStub()
  const SUT = new DbAddExpense(addExpenseRepoStub)

  return {
    sut: SUT,
    addExpenseRepoStub: addExpenseRepoStub,
  }
}

describe('DbAddExpense UseCase', () => {
  test('Should call AddExpenseRepo with correct values', async () => {
    const { sut, addExpenseRepoStub } = makeSUT()
    const addExpenseSpy = jest.spyOn(addExpenseRepoStub, 'add')
    const expenseData = makeFakeExpenseData()

    await sut.add(expenseData)

    expect(addExpenseSpy).toHaveBeenCalledWith(makeFakeExpenseData())
  })

  test('Should throws if addExpense throws', async () => {
    const { sut, addExpenseRepoStub } = makeSUT()
    jest.spyOn(addExpenseRepoStub, 'add').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )
    const expenseData = makeFakeExpenseData()
  
    const expensePromise = sut.add(expenseData)

    await expect(expensePromise).rejects.toThrow()
  })

  test('Should AddExpenseRepo return an expense', async () => {
    const { sut } = makeSUT()
    const expenseData = makeFakeExpenseData()

    const expense = await sut.add(expenseData)

    expect(expense).toEqual(makeFakeExpense())
  })
})
