import { DeleteInvite } from "../../../src/domain/useCases/deleteInvite"
import { DeleteInviteController } from "../../../src/presentation/controllers/invite/deleteInviteController"
import { MissingParamError, ServerError } from "../../../src/presentation/errors"
import { badRequest, ok, serverError } from "../../../src/presentation/helpers/httpHelpers"
import { HttpRequest } from "../../../src/presentation/interfaces"
import { Validation } from "../../../src/presentation/interfaces/validation"

const makeFakeRequest = (): HttpRequest => ({
  params: {
    id: 'invite_id'
  }
})

const makeDeleteInviteStub = (): DeleteInvite => {
  class DeleteInviteStub implements DeleteInvite {
    async delete (id: string): Promise<string> {
      return new Promise(resolve => resolve(id))
    }
  }
  return new DeleteInviteStub()
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
  sut: DeleteInviteController
  deleteInviteStub: DeleteInvite
  validationStub: Validation
}

const makeSUT = (): SUTTypes => {
  const deleteInviteStub = makeDeleteInviteStub()
  const validationStub = makeValidation()
  const SUT = new DeleteInviteController(deleteInviteStub, validationStub)

  return {
    sut: SUT,
    deleteInviteStub: deleteInviteStub,
    validationStub: validationStub
  }
}

describe('DeleteInvite Controller', () => {
  describe('delete', () => {
    test('Should call DeleteInvite with correct values', async () => {
      const { sut, deleteInviteStub } = makeSUT()

      const deleteSpy = jest.spyOn(deleteInviteStub, 'delete')
      const httpRequest = makeFakeRequest()

      await sut.handle(httpRequest)

      expect(deleteSpy).toHaveBeenCalledWith('invite_id')
    })

    test('Should return 500 if delete throw an error', async () => {
      const { sut, deleteInviteStub } = makeSUT()
  
      jest.spyOn(deleteInviteStub, 'delete').mockImplementationOnce(async () => {
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

    expect(httpResponse).toEqual(ok({ message: 'Invite deleted succesfully' }))
  })
})