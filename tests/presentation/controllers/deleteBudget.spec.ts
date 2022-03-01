import { DeleteBudget } from "../../../src/domain/useCases/deleteBudget"
import { DeleteBudgetController } from "../../../src/presentation/controllers/budget/deleteBudgetController"
import { MissingParamError, ServerError } from "../../../src/presentation/errors"
import { badRequest, ok, serverError } from "../../../src/presentation/helpers/httpHelpers"
import { HttpRequest } from "../../../src/presentation/interfaces"
import { Validation } from "../../../src/presentation/interfaces/validation"

const makeFakeRequest = (): HttpRequest => ({
  params: {
    id: 'budget_id'
  }
})

const makeDeleteBudgetStub = (): DeleteBudget => {
  class DeleteBudgetStub implements DeleteBudget {
    async deleteById (id: string): Promise<string> {
      return new Promise(resolve => resolve(id))
    }
  }
  return new DeleteBudgetStub()
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
  sut: DeleteBudgetController
  deleteBudgetStub: DeleteBudget
  validationStub: Validation
}

const makeSUT = (): SUTTypes => {
  const deleteBudgetStub = makeDeleteBudgetStub()
  const validationStub = makeValidation()
  const SUT = new DeleteBudgetController(deleteBudgetStub, validationStub)

  return {
    sut: SUT,
    deleteBudgetStub: deleteBudgetStub,
    validationStub: validationStub
  }
}

describe('DeleteBudget Controller', () => {
  describe('delete', () => {
    test('Should call DeleteBudget with correct values', async () => {
      const { sut, deleteBudgetStub } = makeSUT()

      const deleteSpy = jest.spyOn(deleteBudgetStub, 'deleteById')
      const httpRequest = makeFakeRequest()

      await sut.handle(httpRequest)

      expect(deleteSpy).toHaveBeenCalledWith('budget_id')
    })

    test('Should return 500 if delete throw an error', async () => {
      const { sut, deleteBudgetStub } = makeSUT()
  
      jest.spyOn(deleteBudgetStub, 'deleteById').mockImplementationOnce(async () => {
        return new Promise((resolve, reject) => reject(new Error()))
      })
  
      const httpRequest = makeFakeRequest()
      const httpResponse = await sut.handle(httpRequest)
  
      expect(httpResponse).toEqual(serverError(new ServerError('Something went really wrong')))
    })
  })
  describe('validation', () => {
    test('Should call Validation with correct values', async () => {
      const { sut, validationStub } = makeSUT()

      const validateSpy = jest.spyOn(validationStub, 'validate')
      const httpRequest = makeFakeRequest()

      await sut.handle(httpRequest)

      expect(validateSpy).toHaveBeenCalledWith(httpRequest.params)
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

    expect(httpResponse).toEqual(ok(true))
  })
})
