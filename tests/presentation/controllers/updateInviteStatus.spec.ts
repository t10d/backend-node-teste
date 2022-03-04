import { InviteModel } from "../../../src/domain/models"
import { UpdateInviteStatus, UpdateInviteStatusModel } from "../../../src/domain/useCases/updateInviteStatus"
import { UpdateInviteStatusController } from "../../../src/presentation/controllers/invite/updateInviteStatusController"
import { MissingParamError, ServerError } from "../../../src/presentation/errors"
import { badRequest, ok, serverError } from "../../../src/presentation/helpers/httpHelpers"
import { HttpRequest } from "../../../src/presentation/interfaces"
import { Validation } from "../../../src/presentation/interfaces/validation"


const makeFakeRequest = (status: string): HttpRequest => ({
  params: {
    id: 'id',
  },
  body: {
    status: status,
    userId: 'logged_user_id',
  }
})

const makeInviteModel = (date: Date, status: string): InviteModel => ({
  id: 'id',
  description: 'invite_desc',
  userId: 'from_user_id',
  to: 'to_user_id',
  date: date,
  budgetId: 'budget_id',
  status: status
})

const date = new Date()

const makeUpdateInviteStatusStub = (): UpdateInviteStatus => {
  class UpdateInviteStatusStub implements UpdateInviteStatus {
    async updateStatus (object: UpdateInviteStatusModel): Promise<boolean> {
      return new Promise(resolve => resolve(true))
    }
  }
  return new UpdateInviteStatusStub()
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
  sut: UpdateInviteStatusController
  updateInviteStatusStub: UpdateInviteStatus
  validationStub: Validation
}

const makeSUT = (): SUTTypes => {
  const updateInviteStatusStub = makeUpdateInviteStatusStub()
  const validationStub = makeValidation()
  const SUT = new UpdateInviteStatusController(updateInviteStatusStub, validationStub)

  return {
    sut: SUT,
    updateInviteStatusStub: updateInviteStatusStub,
    validationStub: validationStub
  }
}

describe('Invite Controller', () => {
  describe('UpdateInviteStatus.update', () => {
    test('Should call with correct values', async () => {
      const { sut, updateInviteStatusStub } = makeSUT()

      const updateSpy = jest.spyOn(updateInviteStatusStub, 'updateStatus')

      const httpRequestAccepted = makeFakeRequest('accepted')
      await sut.handle(httpRequestAccepted)
      expect(updateSpy).toHaveBeenCalledWith({ ...httpRequestAccepted.params, ...httpRequestAccepted.body })

      const httpRequestRejected = makeFakeRequest('rejected')
      await sut.handle(httpRequestRejected) 
      expect(updateSpy).toHaveBeenCalledWith({ ...httpRequestRejected.params, ...httpRequestRejected.body })
    })

    test('Should return 500 if throw an error', async () => {
      const { sut, updateInviteStatusStub } = makeSUT()

      jest.spyOn(updateInviteStatusStub, 'updateStatus').mockImplementationOnce(async () => {
        return new Promise((resolve, reject) => reject(new Error()))
      })

      const httpRequest = makeFakeRequest('anything')
      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(serverError(new ServerError('Internal Server Error')))
    })
  })
  describe('Validation.validate', () => {
    test('Should call with correct values', async () => {
      const { sut, validationStub } = makeSUT()

      const validateSpy = jest.spyOn(validationStub, 'validate')

      const httpRequestAccepted = makeFakeRequest('accepted')
      await sut.handle(httpRequestAccepted)
      expect(validateSpy).toHaveBeenCalledWith({ ...httpRequestAccepted.params, ...httpRequestAccepted.body })

      const httpRequestRejected = makeFakeRequest('rejected')
      await sut.handle(httpRequestRejected)
      expect(validateSpy).toHaveBeenCalledWith({ ...httpRequestRejected.params, ...httpRequestRejected.body })
    })

    test('Should return 400 with validation fails', async () => {
      const { sut, validationStub } = makeSUT()

      jest.spyOn(validationStub, 'validate')
        .mockReturnValueOnce(new MissingParamError('any_param'))
      const httpRequest = makeFakeRequest('anything')
      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(badRequest(new MissingParamError('any_param')))
    })
  })
  test('Should return 200 if all right', async () => {
    const { sut } = makeSUT()

    const httpRequest = makeFakeRequest('anything')
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(ok({ message: 'Invite status updated succesfully' }))
  })
})