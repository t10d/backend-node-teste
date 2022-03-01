import { AddInviteModel } from "../../../../src/domain/useCases"
import { InviteFirestoreRepo } from "../../../../src/infra/db/firestore/inviteFirestoreRepo"
import { FirestoreHelper } from "../../../../src/infra/helpers/firestoreHelper"

interface SUTTypes {
  sut: InviteFirestoreRepo
}

const makeSUT = (): SUTTypes => {
  const sut = new InviteFirestoreRepo()
  return {
    sut
  }
}

const makeAddInvite = (date: Date): AddInviteModel => ({
  description: 'invite_desc',
  from: 'from_user_id',
  to: 'to_user_id',
  date: date,
  budgetId: 'budget_id'
})

const date = new Date()

describe('Invite Repository', () => {
  beforeAll(() => {
    FirestoreHelper.connect()
  })
 
  beforeEach(async () => {
    await FirestoreHelper.deleteAll('invites')
  })

  describe('add', () => {
    test('Should return a invite on add success', async () => {
      const { sut } = makeSUT()

      const invite = await sut.add(makeAddInvite(date))

      expect(invite).toBeTruthy()
      expect(invite.id).toBeTruthy()
      expect(invite.description).toBe('invite_desc')
      expect(invite.from).toBe('from_user_id')
      expect(invite.to).toBe('to_user_id')
      expect(invite.date).toBe(date)
      expect(invite.budgetId).toBe('budget_id')
    })
  })
})