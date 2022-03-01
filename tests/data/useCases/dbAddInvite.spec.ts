import { DbAddInvite } from "../../../src/data/useCases/invite/dbAddInvite"
import { AddInviteRepo } from "../../../src/data/useCases/invite/interfaces"
import { InviteModel } from "../../../src/domain/models/inviteModel"
import { AddInviteModel } from "../../../src/domain/useCases/addInvite"

const makeFakeInviteData = (date: Date): AddInviteModel => ({
  description: 'invite_desc',
  from: 'from_user_id',
  to: 'to_user_id',
  date: date,
  budgetId: 'budget_id'
})

const makeFakeInvite = (date: Date): InviteModel => ({
  id: 'id',
  description: 'invite_desc',
  from: 'from_user_id',
  to: 'to_user_id',
  date: date,
  budgetId: 'budget_id'
})

const date = new Date()

const makeAddInviteRepoStub = (): AddInviteRepo => {
  class InviteRepositoryStub implements AddInviteRepo {
    async add (inviteData: AddInviteModel): Promise<InviteModel> {
      const fakeInvite = makeFakeInvite(date)
      return new Promise(resolve => resolve(fakeInvite))
    }
  }
  return new InviteRepositoryStub()
}

interface SUTTypes {
  sut: DbAddInvite
  addInviteRepoStub: AddInviteRepo
}

const makeSUT = (): SUTTypes => {
  const addInviteRepoStub = makeAddInviteRepoStub()
  const SUT = new DbAddInvite(addInviteRepoStub)

  return {
    sut: SUT,
    addInviteRepoStub: addInviteRepoStub,
  }
}

describe('DbAddInvite UseCase', () => {
  
  test('Should call AddInviteRepo with correct values', async () => {
    const { sut, addInviteRepoStub } = makeSUT()
    const addInviteSpy = jest.spyOn(addInviteRepoStub, 'add')
    const inviteData = makeFakeInviteData(date)

    await sut.add(inviteData)

    expect(addInviteSpy).toHaveBeenCalledWith(makeFakeInviteData(date))
  })

  test('Should throws if addInviteRepo throws', async () => {
    const { sut, addInviteRepoStub } = makeSUT()
    jest.spyOn(addInviteRepoStub, 'add').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )
    const inviteData = makeFakeInviteData(date)
  
    const invitePromise = sut.add(inviteData)

    await expect(invitePromise).rejects.toThrow()
  })

  test('Should return a invite on Add success', async () => {
    const { sut } = makeSUT()
    const inviteData = makeFakeInviteData(date)

    const invite = await sut.add(inviteData)

    expect(invite).toEqual(makeFakeInvite(date))
  })
})