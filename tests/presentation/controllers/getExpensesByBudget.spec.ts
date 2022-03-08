import { ExpenseModel } from "../../../src/domain/models"
import { GetExpensesByBudget } from "../../../src/domain/useCases/GetExpensesByBudget"
import { GetExpensesByBudgetController } from "../../../src/presentation/controllers/expense/getExpensesByBudgetController"
import { MissingParamError, ServerError } from "../../../src/presentation/errors"
import { badRequest, ok, serverError } from "../../../src/presentation/helpers/httpHelpers"
import { HttpRequest } from "../../../src/presentation/interfaces"
import { Validation } from "../../../src/presentation/interfaces/validation"

const makeFakeRequest = (): HttpRequest => ({
  query: {
    budgetId: 'budget_id'
  },
  body: {
    userId: 'user_id'
  }
})

const makeExpenseModel = (): ExpenseModel => ({
  id: 'id',
  name: 'expense_name',
  category: 'food',
  realized: 420,
  projected: 500,
  type: 'variable',
  budgetId: 'budget_id'
})

const makeGetExpensesByBudgetStub = (): GetExpensesByBudget => {
  class GetExpensesByBudgetStub implements GetExpensesByBudget {
    async getByBudget (id: string): Promise<ExpenseModel[]> {
      return new Promise(resolve => resolve([makeExpenseModel()]))
    }
  }
  return new GetExpensesByBudgetStub()
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
  sut: GetExpensesByBudgetController
  getExpensesByBudgetStub: GetExpensesByBudget
  validationStub: Validation
}

const makeSUT = (): SUTTypes => {
  const getExpensesByBudgetStub = makeGetExpensesByBudgetStub()
  const validationStub = makeValidation()
  const sut = new GetExpensesByBudgetController(getExpensesByBudgetStub, validationStub)

  return {
    sut,
    getExpensesByBudgetStub,
    validationStub
  }
}

describe('GetExpensesByBudget Controller', () => {
  describe('get', () => {
    test('Should call GetExpensesByBudget with correct values', async () => {
      const { sut, getExpensesByBudgetStub } = makeSUT()

      const deleteSpy = jest.spyOn(getExpensesByBudgetStub, 'getByBudget')
      const httpRequest = makeFakeRequest()

      await sut.handle(httpRequest)

      expect(deleteSpy).toHaveBeenCalledWith('budget_id', 'user_id')
    })

    test('Should return 500 if get throw an error', async () => {
      const { sut, getExpensesByBudgetStub } = makeSUT()
  
      jest.spyOn(getExpensesByBudgetStub, 'getByBudget').mockImplementationOnce(async () => {
        return new Promise((resolve, reject) => reject(new Error()))
      })
  
      const httpRequest = makeFakeRequest()
      const httpResponse = await sut.handle(httpRequest)
  
      expect(httpResponse).toEqual(serverError(new ServerError('Internal error')))
    })
  })
  describe('validation', () => {
    test('Should call Validation with correct values', async () => {
      const { sut, validationStub } = makeSUT()

      const validateSpy = jest.spyOn(validationStub, 'validate')
      const httpRequest = makeFakeRequest()

      await sut.handle(httpRequest)

      expect(validateSpy).toHaveBeenCalledWith(httpRequest.query)
    })

    test('Should return 400 with validation fails', async () => {
      const { sut, validationStub } = makeSUT()

      jest.spyOn(validationStub, 'validate')
        .mockReturnValueOnce(new MissingParamError('any_param'))
      const httpRequest = makeFakeRequest()
      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(badRequest(new MissingParamError('any_param')))
    })
  })
  test('Should return 200 if all right', async () => {
    const { sut } = makeSUT()

    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(ok([makeExpenseModel()]))
  })
})