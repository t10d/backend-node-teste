import { ExpenseModel } from "../../../src/domain/models/expenseModel"
import { UpdateExpense, UpdateExpenseModel } from "../../../src/domain/useCases/updateExpense"
import { UpdateExpenseController } from "../../../src/presentation/controllers/expense/updateExpenseController"
import { MissingParamError, ServerError } from "../../../src/presentation/errors"
import { badRequest, ok, serverError } from "../../../src/presentation/helpers/httpHelpers"
import { HttpRequest } from "../../../src/presentation/interfaces"
import { Validation } from "../../../src/presentation/interfaces/validation"

const makeFakeRequest = (): HttpRequest => ({
  params: {
    id: 'id',
  },
  body: {
    name: 'expense_name',
    category: 'food',
    realized: 420,
    projected: 500,
    type: 'variable',
    budgetId: 'budget_id'
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

const makeUpdateExpenseStub = (): UpdateExpense => {
  class UpdateExpenseStub implements UpdateExpense {
    async update (expense: UpdateExpenseModel): Promise<ExpenseModel> {
      const fakeExpense = makeExpenseModel()

      return new Promise(resolve => resolve(fakeExpense))
    }
  }
  return new UpdateExpenseStub()
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
  sut: UpdateExpenseController
  updateExpenseStub: UpdateExpense
  validationStub: Validation
}

const makeSUT = (): SUTTypes => {
  const updateExpenseStub = makeUpdateExpenseStub()
  const validationStub = makeValidation()
  const SUT = new UpdateExpenseController(updateExpenseStub, validationStub)

  return {
    sut: SUT,
    updateExpenseStub: updateExpenseStub,
    validationStub: validationStub
  }
}

describe('Expense Controller', () => {
  describe('UpdateExpense.update', () => {
    test('Should call with correct values', async () => {
      const { sut, updateExpenseStub } = makeSUT()

      const updateSpy = jest.spyOn(updateExpenseStub, 'update')
      const httpRequest = makeFakeRequest()

      await sut.handle(httpRequest)

      expect(updateSpy).toHaveBeenCalledWith({ ...httpRequest.params, ...httpRequest.body })
    })

    test('Should handle undefined values', async () => {
      const { sut, updateExpenseStub } = makeSUT()

      const updateSpy = jest.spyOn(updateExpenseStub, 'update')
      const fakeExpenseModel = makeExpenseModel()

      // iterate over model and make any unrequired values undefined
      const tempExpenseModel = { ...fakeExpenseModel }
      for (const key in tempExpenseModel) {
        if (!['id', 'budgetId'].includes(key)) delete tempExpenseModel[key]

        const httpRequest = { params: { id: 'id' }, body: tempExpenseModel }

        await sut.handle(httpRequest)
        
        expect(updateSpy).toHaveBeenCalledWith(tempExpenseModel)
        tempExpenseModel[key] = fakeExpenseModel[key]
      }
    })

    test('Should return 500 if throw an error', async () => {
      const { sut, updateExpenseStub } = makeSUT()

      jest.spyOn(updateExpenseStub, 'update').mockImplementationOnce(async () => {
        return new Promise((resolve, reject) => reject(new Error()))
      })

      const httpRequest = makeFakeRequest()
      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(serverError(new ServerError('Something went really wrong')))
    })
  })
  describe('Validation.validate', () => {
    test('Should call with correct values', async () => {
      const { sut, validationStub } = makeSUT()

      const validateSpy = jest.spyOn(validationStub, 'validate')
      const httpRequest = makeFakeRequest()

      await sut.handle(httpRequest)

      expect(validateSpy).toHaveBeenCalledWith({ ...httpRequest.params, ...httpRequest.body })
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

    expect(httpResponse).toEqual(ok(makeExpenseModel()))
  })
})