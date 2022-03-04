import { InviteModel } from "../../../src/domain/models"
import { GetInvites } from "../../../src/domain/useCases/GetInvites"
import { GetInvitesController } from "../../../src/presentation/controllers/invite/getInvitesController"
import { ServerError } from "../../../src/presentation/errors"
import { ok, serverError } from "../../../src/presentation/helpers/httpHelpers"
import { HttpRequest } from "../../../src/presentation/interfaces"

const makeFakeSendedRequest = (): HttpRequest => ({
  body: {
    userId: 'user_id',
  }
})

const makeFakeReceivedRequest = (): HttpRequest => ({
  body: {
    userId: 'user_id',
  },
  query: {
    toMe: true
  }
})

const makeInviteModel = (date): InviteModel => ({
  id: 'invite_id',
  description: 'invite_description',
  userId: 'invite_userId',
  to: 'invite_to',
  date: date,
  budgetId: 'invite_budgetId',
  status: 'invite_status',
})

const date = new Date()

const makeGetInvitesStub = (): GetInvites => {
  class GetInvitesStub implements GetInvites {
    async getAll (userId: string, sended: boolean): Promise<InviteModel[]> {
      return new Promise(resolve => resolve([makeInviteModel(date)]))
    }
  }
  return new GetInvitesStub()
}

interface SUTTypes {
  sut: GetInvitesController
  getInvitesStub: GetInvites
}

const makeSUT = (): SUTTypes => {
  const getInvitesStub = makeGetInvitesStub()
  const sut = new GetInvitesController(getInvitesStub)

  return {
    sut,
    getInvitesStub
  }
}

describe('GetInvites Controller', () => {
  describe('get', () => {
    test('Should call GetInvites with correct values', async () => {
      const { sut, getInvitesStub } = makeSUT()

      const getAll = jest.spyOn(getInvitesStub, 'getAll')

      const httpSendedRequest = makeFakeSendedRequest()
      await sut.handle(httpSendedRequest)
      expect(getAll).toHaveBeenCalledWith('user_id', undefined)

      const httpReceivedRequest = makeFakeReceivedRequest()
      await sut.handle(httpReceivedRequest)
      expect(getAll).toHaveBeenCalledWith('user_id', true)
    })

    test('Should return 500 if get throw an error', async () => {
      const { sut, getInvitesStub } = makeSUT()
  
      jest.spyOn(getInvitesStub, 'getAll').mockImplementationOnce(async () => {
        return new Promise((resolve, reject) => reject(new Error()))
      })
  
      const httpRequest = makeFakeSendedRequest()
      const httpResponse = await sut.handle(httpRequest)
  
      expect(httpResponse).toEqual(serverError(new ServerError('Internal error')))
    })
  })
  test('Should return 200 if all right', async () => {
    const { sut } = makeSUT()

    const httpSendedRequest = makeFakeSendedRequest()
    const httpSendedResponse = await sut.handle(httpSendedRequest)
    expect(httpSendedResponse).toEqual(ok([makeInviteModel(date)]))

    const httpReceivedRequest = makeFakeReceivedRequest()
    const httpReceivedResponse = await sut.handle(httpReceivedRequest)
    expect(httpReceivedResponse).toEqual(ok([makeInviteModel(date)]))
  })
})