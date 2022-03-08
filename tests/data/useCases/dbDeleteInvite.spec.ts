import { DeleteInviteRepo } from "../../../src/data/interfaces/db/invite/deleteInviteRepo"
import { DbDeleteInvite } from "../../../src/data/useCases/invite/dbDeleteInvite"

const makeFakeInviteData = (): any => ('invite_id')

const makeDeleteInviteRepoStub = (): DeleteInviteRepo => {
  class InviteDeleteRepositoryStub implements DeleteInviteRepo {
    async delete (id: string): Promise<string> {
      return new Promise(resolve => resolve(id))
    }
  }
  return new InviteDeleteRepositoryStub()
}

interface SUTTypes {
  sut: DbDeleteInvite
  deleteInviteRepoStub: DeleteInviteRepo
}

const makeSUT = (): SUTTypes => {
  const deleteInviteRepoStub = makeDeleteInviteRepoStub()
  const SUT = new DbDeleteInvite(deleteInviteRepoStub)

  return {
    sut: SUT,
    deleteInviteRepoStub: deleteInviteRepoStub,
  }
}

describe('DbDeleteInvite UseCase', () => {
  test('Should call DeleteInviteRepo with correct values', async () => {
    const { sut, deleteInviteRepoStub } = makeSUT()
    const deleteInviteSpy = jest.spyOn(deleteInviteRepoStub, 'delete')

    await sut.delete(makeFakeInviteData())

    expect(deleteInviteSpy).toHaveBeenCalledWith(makeFakeInviteData())
  })

  test('Should throws if deleteInvite throws', async () => {
    const { sut, deleteInviteRepoStub } = makeSUT()
    jest.spyOn(deleteInviteRepoStub, 'delete').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )
  
    const invitePromise = sut.delete(makeFakeInviteData())

    await expect(invitePromise).rejects.toThrow()
  })

  test('Should DeleteInviteRepo return void in success', async () => {
    const { sut } = makeSUT()
    const inviteData = makeFakeInviteData()

    const invite = await sut.delete(inviteData)

    expect(invite).toBe("invite_id")
  })
})