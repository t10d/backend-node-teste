import { AddBudgetRepo } from "../../../src/data/interfaces/db/budget/addBudgetRepo"
import { DbAddBudget } from "../../../src/data/useCases/budget/dbAddBudget"
import { BudgetModel } from "../../../src/domain/models/budgetModel"
import { AddBudgetModel } from "../../../src/domain/useCases/addBudget"

const makeFakeBudgetData = (): any => ({
  name: 'budget_name',
  totalRealized: 42,
  totalProjected: 420
})

const makeFakeBudget = (): BudgetModel => ({
  id: 'id',
  name: 'budget_name',
  totalRealized: 42,
  totalProjected: 420,
  userID: 'user_id'
})

const makeAddBudgetRepoStub = (): AddBudgetRepo => {
  class BudgetRepositoryStub implements AddBudgetRepo {
    async add (budgetData: AddBudgetModel): Promise<BudgetModel> {
      const fakeBudget = makeFakeBudget()
      return new Promise(resolve => resolve(fakeBudget))
    }
  }
  return new BudgetRepositoryStub()
}

interface SUTTypes {
  sut: DbAddBudget
  addBudgetRepoStub: AddBudgetRepo
}

const makeSUT = (): SUTTypes => {
  const addBudgetRepoStub = makeAddBudgetRepoStub()
  const SUT = new DbAddBudget(addBudgetRepoStub)

  return {
    sut: SUT,
    addBudgetRepoStub: addBudgetRepoStub,
  }
}

describe('DbAddBudget UseCase', () => {
  test('Should call AddBudgetRepo with correct values', async () => {
    const { sut, addBudgetRepoStub } = makeSUT()
    const addBudgetSpy = jest.spyOn(addBudgetRepoStub, 'add')
    const budgetData = makeFakeBudgetData()

    await sut.add(budgetData)

    expect(addBudgetSpy).toHaveBeenCalledWith(makeFakeBudgetData())
  })

  test('Should throws if addBudget throws', async () => {
    const { sut, addBudgetRepoStub } = makeSUT()
    jest.spyOn(addBudgetRepoStub, 'add').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )
    const budgetData = makeFakeBudgetData()
  
    const budgetPromise = sut.add(budgetData)

    await expect(budgetPromise).rejects.toThrow()
  })

  test('Should AddBudgetRepo return an budget', async () => {
    const { sut } = makeSUT()
    const budgetData = makeFakeBudgetData()

    const budget = await sut.add(budgetData)

    expect(budget).toEqual(makeFakeBudget())
  })
})
