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
  userId: 'from_user_id',
  to: 'to_user_id',
  date: date,
  budgetId: 'budget_id'
})

const date = new Date()

describe('Invite Repository', () => {
  beforeAll(async () => {
    FirestoreHelper.connect()

    const userDoc = FirestoreHelper.db.collection('users').doc('to_user_id')
    await userDoc.set({
      id: 'to_user_id',
      name: 'user_name',
      email: 'user_email',
      password: 'user_password'
    })
  })
 
  beforeEach(async () => {
    await FirestoreHelper.deleteCollection('invites', 100)
  })

  afterAll(async () => {
    await FirestoreHelper.deleteCollection('users', 100)
  })

  describe('add', () => {
    test('Should return a invite on add success', async () => {
      const { sut } = makeSUT()

      const invite = await sut.add(makeAddInvite(date))

      expect(invite).toBeTruthy()
      expect(invite.id).toBeTruthy()
      expect(invite.description).toBe('invite_desc')
      expect(invite.userId).toBe('from_user_id')
      expect(invite.to).toBe('to_user_id')
      expect(invite.date).toBe(date)
      expect(invite.budgetId).toBe('budget_id')
    })

    test('Should return null if to_user_id not found', async () => {
      const { sut } = makeSUT()

      await FirestoreHelper.getCollection('users').doc('to_user_id').delete()

      const invite = await sut.add(makeAddInvite(date))

      expect(invite).toBeNull()
    })
  })

  describe('delete', () => {
    test('Should return null on delete success', async () => {
      const { sut } = makeSUT()

      FirestoreHelper.db.collection('invites').doc('invite_id').set(makeAddInvite(date))
      const invite = await sut.delete('invite_id')

      expect(invite).toBeNull()
    })

    test('Should return null if not found', async () => {
      const { sut } = makeSUT()

      await FirestoreHelper.getCollection('invites').doc('invite_id').delete()

      const invite = await sut.delete('invite_id')

      expect(invite).toBeNull()
    })
  })
})