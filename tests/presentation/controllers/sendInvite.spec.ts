import { InviteModel } from "../../../src/domain/models/inviteModel"
import { AddInvite, AddInviteModel } from "../../../src/domain/useCases/addInvite"
import { AddInviteController } from "../../../src/presentation/controllers/invite/addInviteController"
import { MissingParamError, ServerError } from "../../../src/presentation/errors"
import { badRequest, ok, serverError } from "../../../src/presentation/helpers/httpHelpers"
import { HttpRequest } from "../../../src/presentation/interfaces"
import { Validation } from "../../../src/presentation/interfaces/validation"

const makeFakeRequest = (date: Date): HttpRequest => ({
  body: {
    description: 'invite_desc',
    from: 'from_user_id',
    to: 'to_user_id',
    date: date,
    budgetId: 'budget_id'
  }
})

const makeInviteModel = (date: Date): InviteModel => ({
  id: 'id',
  description: 'invite_desc',
  from: 'from_user_id',
  to: 'to_user_id',
  date: date,
  budgetId: 'budget_id'
})

let date = new Date()

const makeAddInviteStub = (): AddInvite => {
  class AddInviteStub implements AddInvite {
    async add (invite: AddInviteModel): Promise<InviteModel> {
      const fakeInvite = makeInviteModel(date)

      return new Promise(resolve => resolve(fakeInvite))
    }
  }
  return new AddInviteStub()
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
  sut: AddInviteController
  addInviteStub: AddInvite
  validationStub: Validation
}

const makeSUT = (): SUTTypes => {
  const addInviteStub = makeAddInviteStub()
  const validationStub = makeValidation()
  const SUT = new AddInviteController(addInviteStub, validationStub)

  return {
    sut: SUT,
    addInviteStub: addInviteStub,
    validationStub: validationStub
  }
}

describe('Invite Controller', () => {
  beforeAll(() => {
    date = new Date()
  })

  describe('AddInvite', () => {
    test('Should call AddInvite with correct values', async () => {
      const { sut, addInviteStub } = makeSUT()

      const addSpy = jest.spyOn(addInviteStub, 'add')
      const httpRequest = makeFakeRequest(date)

      await sut.handle(httpRequest)

      const fakeInviteModel = makeInviteModel(date)
      delete fakeInviteModel.id

      expect(addSpy).toHaveBeenCalledWith(fakeInviteModel)
    })

    test('Should return 500 if AddInvite throw an error', async () => {
      const { sut, addInviteStub } = makeSUT()
  
      jest.spyOn(addInviteStub, 'add').mockImplementationOnce(async () => {
        return new Promise((resolve, reject) => reject(new Error()))
      })
  
      const httpRequest = makeFakeRequest(date)
      const httpResponse = await sut.handle(httpRequest)
  
      expect(httpResponse).toEqual(serverError(new ServerError('Internal Error')))
    })
  })
  describe('Validation', () => {
    test('Should call Validation with correct values', async () => {
      const { sut, validationStub } = makeSUT()

      const validateSpy = jest.spyOn(validationStub, 'validate')
      const httpRequest = makeFakeRequest(date)

      await sut.handle(httpRequest)

      expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
    })

    test('Should return 400 with Validation fails', async () => {
      const { sut, validationStub } = makeSUT()

      jest.spyOn(validationStub, 'validate')
        .mockReturnValueOnce(new MissingParamError('any_param'))
      const httpRequest = makeFakeRequest(date)
      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(badRequest(new MissingParamError('any_param')))
    })
  })
  test('Should return 200 if all right', async () => {
    const { sut } = makeSUT()

    const httpRequest = makeFakeRequest(date)
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(ok(makeInviteModel(date)))
  })
})