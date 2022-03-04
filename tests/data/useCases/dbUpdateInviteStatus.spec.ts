import { UpdateInviteStatusRepo } from "../../../src/data/interfaces/db/invite/updateInviteStatusRepo"
import { DbUpdateInviteStatus } from "../../../src/data/useCases/invite/dbUpdateInviteStatus"
import { InviteModel } from "../../../src/domain/models"
import { UpdateInviteStatusModel } from "../../../src/domain/useCases/updateInviteStatus"

const makeFakeInviteData = (): UpdateInviteStatusModel => ({
  id: 'id',
  status: 'any_status',
  userId: 'user_id',
})

const makeFakeInvite = (date: Date, status: string): InviteModel => ({
  id: 'id',
  description: 'invite_desc',
  userId: 'from_user_id',
  to: 'to_user_id',
  date: date,
  budgetId: 'budget_id',
  status: status
})

const date = new Date()

const makeUpdateInviteStatusRepoStub = (): UpdateInviteStatusRepo => {
  class InviteRepositoryStub implements UpdateInviteStatusRepo {
    async updateStatus (inviteData: UpdateInviteStatusModel): Promise<boolean> {
      return new Promise(resolve => resolve(true))
    }
  }
  return new InviteRepositoryStub()
}

interface SUTTypes {
  sut: DbUpdateInviteStatus
  updateInviteStatusRepoStub: UpdateInviteStatusRepo
}

const makeSUT = (): SUTTypes => {
  const updateInviteStatusRepoStub = makeUpdateInviteStatusRepoStub()
  const SUT = new DbUpdateInviteStatus(updateInviteStatusRepoStub)

  return {
    sut: SUT,
    updateInviteStatusRepoStub: updateInviteStatusRepoStub,
  }
}

describe('DbUpdateInviteStatus UseCase', () => {
  test('Should call update with correct values', async () => {
    const { sut, updateInviteStatusRepoStub } = makeSUT()
    const updateInviteStatusSpy = jest.spyOn(updateInviteStatusRepoStub, 'updateStatus')
    const inviteData = makeFakeInviteData()

    await sut.updateStatus(inviteData)

    expect(updateInviteStatusSpy).toHaveBeenCalledWith(makeFakeInviteData())
  })

  test('Should throws if update throws', async () => {
    const { sut, updateInviteStatusRepoStub } = makeSUT()
    jest.spyOn(updateInviteStatusRepoStub, 'updateStatus').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )
    const inviteData = makeFakeInviteData()
  
    const invitePromise = sut.updateStatus(inviteData)

    await expect(invitePromise).rejects.toThrow()
  })

  test('Should return true on success', async () => {
    const { sut } = makeSUT()
    const inviteData = makeFakeInviteData()

    const invite = await sut.updateStatus(inviteData)

    expect(invite).toEqual(true)
  })
})