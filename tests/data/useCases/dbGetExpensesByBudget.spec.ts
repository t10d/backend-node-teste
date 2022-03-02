import { GetExpensesByBudgetRepo } from "../../../src/data/interfaces/db/expense/getExpensesByBudgetRepo"
import { DbGetExpensesByBudget } from "../../../src/data/useCases/expense/dbGetExpenseByBudget"
import { ExpenseModel } from "../../../src/domain/models"

const makeFakeExpense = (): ExpenseModel => ({
  id: 'id',
  name: 'expense_name',
  category: 'food',
  realized: 420,
  projected: 500,
  type: 'variable',
  budgetId: 'budget_id'
})

const makeGetExpensesByBudgetRepoStub = (): GetExpensesByBudgetRepo => {
  class GetExpensesByBudgetRepoStub implements GetExpensesByBudgetRepo {
    async getByBudget (): Promise<[ExpenseModel]> {
      return new Promise(resolve => resolve([makeFakeExpense()]))
    }
  }
  return new GetExpensesByBudgetRepoStub()
}

interface SUTTypes {
  sut: DbGetExpensesByBudget
  addGetExpensesByBudgetRepoStub: GetExpensesByBudgetRepo
}

const makeSUT = (): SUTTypes => {
  const addGetExpensesByBudgetRepoStub = makeGetExpensesByBudgetRepoStub()
  const SUT = new DbGetExpensesByBudget(addGetExpensesByBudgetRepoStub)

  return {
    sut: SUT,
    addGetExpensesByBudgetRepoStub: addGetExpensesByBudgetRepoStub,
  }
}

describe('DbGetExpensesByBudget UseCase', () => {
  describe('getByBudget', () => {
    test('Should call get with correct values', async () => {
      const { sut, addGetExpensesByBudgetRepoStub } = makeSUT()
      const getExpensesByBudgetSpy = jest.spyOn(addGetExpensesByBudgetRepoStub, 'getByBudget')

      await sut.getByBudget('budget_id', 'user_id')

      expect(getExpensesByBudgetSpy).toHaveBeenCalledWith('budget_id', 'user_id')
    })

    test('Should throws if getByBudget throws', async () => {
      const { sut, addGetExpensesByBudgetRepoStub } = makeSUT()
      jest.spyOn(addGetExpensesByBudgetRepoStub, 'getByBudget').mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    
      const getExpensesByBudgetPromise = sut.getByBudget('budget_id', 'user_id')

      await expect(getExpensesByBudgetPromise).rejects.toThrow()
    })
  })

  test('Should return an list of expenses on success', async () => {
    const { sut } = makeSUT()

    const getExpensesByBudget = await sut.getByBudget('budget_id', 'user_id')

    expect(getExpensesByBudget).toEqual([makeFakeExpense()])
  })
})