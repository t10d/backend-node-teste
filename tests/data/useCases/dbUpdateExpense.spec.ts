import { UpdateExpenseRepo } from "../../../src/data/interfaces/db/expense/updateExpenseRepo"
import { DbUpdateExpense } from "../../../src/data/useCases/expense/dbUpdateExpense"
import { ExpenseModel } from "../../../src/domain/models"
import { UpdateExpenseModel } from "../../../src/domain/useCases"

const makeFakeExpenseData = (): UpdateExpenseModel => ({
  id: 'id',
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

const makeUpdateExpenseRepoStub = (): UpdateExpenseRepo => {
  class ExpenseRepositoryStub implements UpdateExpenseRepo {
    async update (expenseData: UpdateExpenseModel): Promise<ExpenseModel> {
      const fakeExpense = makeFakeExpense()
      return new Promise(resolve => resolve(fakeExpense))
    }
  }
  return new ExpenseRepositoryStub()
}

interface SUTTypes {
  sut: DbUpdateExpense
  updateExpenseRepoStub: UpdateExpenseRepo
}

const makeSUT = (): SUTTypes => {
  const updateExpenseRepoStub = makeUpdateExpenseRepoStub()
  const SUT = new DbUpdateExpense(updateExpenseRepoStub)

  return {
    sut: SUT,
    updateExpenseRepoStub: updateExpenseRepoStub,
  }
}

describe('DbUpdateExpense UseCase', () => {
  test('Should call update with correct values', async () => {
    const { sut, updateExpenseRepoStub } = makeSUT()
    const updateExpenseSpy = jest.spyOn(updateExpenseRepoStub, 'update')
    const expenseData = makeFakeExpenseData()

    await sut.update(expenseData)

    expect(updateExpenseSpy).toHaveBeenCalledWith(makeFakeExpenseData())
  })

  test('Should throws if update throws', async () => {
    const { sut, updateExpenseRepoStub } = makeSUT()
    jest.spyOn(updateExpenseRepoStub, 'update').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )
    const expenseData = makeFakeExpenseData()
  
    const expensePromise = sut.update(expenseData)

    await expect(expensePromise).rejects.toThrow()
  })

  test('Should return an expense in success', async () => {
    const { sut } = makeSUT()
    const expenseData = makeFakeExpenseData()

    const expense = await sut.update(expenseData)

    expect(expense).toEqual(makeFakeExpense())
  })
})
