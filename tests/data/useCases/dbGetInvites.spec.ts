import { GetInvitesRepo } from "../../../src/data/interfaces/db/invite/getInvitesRepo"
import { DbGetInvites } from "../../../src/data/useCases/invite/dbGetInvites"
import { InviteModel } from "../../../src/domain/models"

const makeFakeExpense = (date): InviteModel => ({
  id: 'invite_id',
  description: 'invite_description',
  userId: 'invite_userId',
  to: 'invite_to',
  date: date,
  budgetId: 'invite_budgetId',
  status: 'invite_status',
})

const date = new Date()

const makeGetInvitesRepoStub = (): GetInvitesRepo => {
  class GetInvitesRepoStub implements GetInvitesRepo {
    async getAll (): Promise<InviteModel[]> {
      return new Promise(resolve => resolve([makeFakeExpense(date)]))
    }
  }
  return new GetInvitesRepoStub()
}

interface SUTTypes {
  sut: DbGetInvites
  getInvitesRepoStub: GetInvitesRepo
}

const makeSUT = (): SUTTypes => {
  const getInvitesRepoStub = makeGetInvitesRepoStub()
  const sut = new DbGetInvites(getInvitesRepoStub)

  return {
    sut,
    getInvitesRepoStub
  }
}

describe('DbGetInvites UseCase', () => {
  describe('getAll', () => {
    test('Should call get with correct values', async () => {
      const { sut, getInvitesRepoStub } = makeSUT()

      const getInvitesSpy1 = jest.spyOn(getInvitesRepoStub, 'getAll')
      await sut.getAll('user_id', undefined)
      expect(getInvitesSpy1).toHaveBeenCalledWith('user_id', undefined)

      const getInvitesSpy2 = jest.spyOn(getInvitesRepoStub, 'getAll')
      await sut.getAll('user_id', true)
      expect(getInvitesSpy2).toHaveBeenCalledWith('user_id', true)
    })

    test('Should throws if getAll throws', async () => {
      const { sut, getInvitesRepoStub } = makeSUT()

      jest.spyOn(getInvitesRepoStub, 'getAll').mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
      const getInvitesSendedPromise = sut.getAll('user_id', undefined)
      await expect(getInvitesSendedPromise).rejects.toThrow()

      jest.spyOn(getInvitesRepoStub, 'getAll').mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
      const getInvitesReceivedPromise = sut.getAll('user_id', true)
      await expect(getInvitesReceivedPromise).rejects.toThrow()
    })
  })

  test('Should return an list of expenses on success', async () => {
    const { sut } = makeSUT()

    const getInvites = await sut.getAll('user_id', undefined)
    expect(getInvites).toEqual([makeFakeExpense(date)])
  })
})