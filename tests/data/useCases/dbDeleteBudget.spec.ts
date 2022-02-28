import { DeleteBudgetByIdRepo } from "../../../src/data/interfaces/db/budget/deleteBudgetById"
import { DbDeleteBudget } from "../../../src/data/useCases/budget/dbDeleteBudget"

const makeFakeBudgetData = (): any => ('budget_id')

const makeDeleteBudgetRepoStub = (): DeleteBudgetByIdRepo => {
  class BudgetDeleteRepositoryStub implements DeleteBudgetByIdRepo {
    async deleteById (id: string): Promise<string> {
      return new Promise(resolve => resolve(id))
    }
  }
  return new BudgetDeleteRepositoryStub()
}

interface SUTTypes {
  sut: DbDeleteBudget
  deleteBudgetRepoStub: DeleteBudgetByIdRepo
}

const makeSUT = (): SUTTypes => {
  const deleteBudgetRepoStub = makeDeleteBudgetRepoStub()
  const SUT = new DbDeleteBudget(deleteBudgetRepoStub)

  return {
    sut: SUT,
    deleteBudgetRepoStub: deleteBudgetRepoStub,
  }
}

describe('DbDeleteBudget UseCase', () => {
  test('Should call DeleteBudgetRepo with correct values', async () => {
    const { sut, deleteBudgetRepoStub } = makeSUT()
    const deleteBudgetSpy = jest.spyOn(deleteBudgetRepoStub, 'deleteById')

    await sut.deleteById(makeFakeBudgetData())

    expect(deleteBudgetSpy).toHaveBeenCalledWith(makeFakeBudgetData())
  })

  test('Should throws if deleteBudget throws', async () => {
    const { sut, deleteBudgetRepoStub } = makeSUT()
    jest.spyOn(deleteBudgetRepoStub, 'deleteById').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )
  
    const budgetPromise = sut.deleteById(makeFakeBudgetData())

    await expect(budgetPromise).rejects.toThrow()
  })

  test('Should DeleteBudgetRepo return void in success', async () => {
    const { sut } = makeSUT()
    const budgetData = makeFakeBudgetData()

    const budget = await sut.deleteById(budgetData)

    expect(budget).toBe("budget_id")
  })
})