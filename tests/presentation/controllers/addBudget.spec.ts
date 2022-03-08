import { BudgetModel } from "../../../src/domain/models/budgetModel"
import { AddBudget, AddBudgetModel } from "../../../src/domain/useCases/addBudget"
import { AddBudgetController } from "../../../src/presentation/controllers/budget/addBudgetController"
import { MissingParamError, ServerError } from "../../../src/presentation/errors"
import { badRequest, ok, serverError } from "../../../src/presentation/helpers/httpHelpers"
import { HttpRequest } from "../../../src/presentation/interfaces"
import { Validation } from "../../../src/presentation/interfaces/validation"

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'budget_name',
    totalRealized: 42,
    totalProjected: 420,
    userId: 'user_id'
  }
})

const makeBudgetModel = (): BudgetModel => ({
  id: 'id',
  name: 'budget_name',
  totalRealized: 42,
  totalProjected: 420,
  userId: 'user_id'
})

const makeAddBudgetStub = (): AddBudget => {
  class AddBudgetStub implements AddBudget {
    async add (budget: AddBudgetModel): Promise<BudgetModel> {
      const fakeBudget = makeBudgetModel()

      return new Promise(resolve => resolve(fakeBudget))
    }
  }
  return new AddBudgetStub()
}

const makeValidation = (): Validation => {
  class ValidadionStub implements Validation {
    validate (data: any): Error {
      return null
    }
  }
  return new ValidadionStub()
}

interface SUTTypes {
  sut: AddBudgetController
  addBudgetStub: AddBudget
  validationStub: Validation
}

const makeSUT = (): SUTTypes => {
  const addBudgetStub = makeAddBudgetStub()
  const validationStub = makeValidation()
  const SUT = new AddBudgetController(addBudgetStub, validationStub)

  return {
    sut: SUT,
    addBudgetStub: addBudgetStub,
    validationStub: validationStub
  }
}

describe('Budget Controller', () => {
  test('Should call AddBudget.add with correct values', async () => {
    const { sut, addBudgetStub } = makeSUT()

    const addSpy = jest.spyOn(addBudgetStub, 'add')
    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)

    const fakeBudgetModel = makeBudgetModel()
    delete fakeBudgetModel.id

    expect(addSpy).toHaveBeenCalledWith(fakeBudgetModel)
  })

  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSUT()

    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 with validation fails', async () => {
    const { sut, validationStub } = makeSUT()

    jest.spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('any_param'))
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_param')))
  })

  test('Should return 500 if AddBudget.add throw an error', async () => {
    const { sut, addBudgetStub } = makeSUT()

    jest.spyOn(addBudgetStub, 'add').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()))
    })

    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(serverError(new ServerError('Something went really wrong')))
  })

  test('Should return 200 if all right', async () => {
    const { sut } = makeSUT()

    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(ok(makeBudgetModel()))
  })
})
