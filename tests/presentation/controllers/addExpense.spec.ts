import { ExpenseModel } from "../../../src/domain/models/expenseModel"
import { AddExpense, AddExpenseModel } from "../../../src/domain/useCases/addExpense"
import { AddExpenseController } from "../../../src/presentation/controllers/expense/addExpenseController"
import { MissingParamError, ServerError } from "../../../src/presentation/errors"
import { badRequest, ok, serverError } from "../../../src/presentation/helpers/httpHelpers"
import { HttpRequest } from "../../../src/presentation/interfaces"
import { Validation } from "../../../src/presentation/interfaces/validation"

const makeFakeRequest = (): HttpRequest => ({
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

const makeAddExpenseStub = (): AddExpense => {
  class AddExpenseStub implements AddExpense {
    async add (expense: AddExpenseModel): Promise<ExpenseModel> {
      const fakeExpense = makeExpenseModel()

      return new Promise(resolve => resolve(fakeExpense))
    }
  }
  return new AddExpenseStub()
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
  sut: AddExpenseController
  addExpenseStub: AddExpense
  validationStub: Validation
}

const makeSUT = (): SUTTypes => {
  const addExpenseStub = makeAddExpenseStub()
  const validationStub = makeValidation()
  const SUT = new AddExpenseController(addExpenseStub, validationStub)

  return {
    sut: SUT,
    addExpenseStub: addExpenseStub,
    validationStub: validationStub
  }
}

describe('Expense Controller', () => {
  test('Should call AddExpense with correct values', async () => {
    const { sut, addExpenseStub } = makeSUT()

    const addSpy = jest.spyOn(addExpenseStub, 'add')
    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)

    const fakeExpenseModel = makeExpenseModel()
    delete fakeExpenseModel.id

    expect(addSpy).toHaveBeenCalledWith(fakeExpenseModel)
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

  test('Should return 500 if add user throw an error', async () => {
    const { sut, addExpenseStub } = makeSUT()

    jest.spyOn(addExpenseStub, 'add').mockImplementationOnce(async () => {
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

    expect(httpResponse).toEqual(ok(makeExpenseModel()))
  })
})