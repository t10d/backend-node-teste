import { InviteModel } from "../../../../src/domain/models"
import { AddInviteModel } from "../../../../src/domain/useCases"
import { UpdateInviteStatusModel } from "../../../../src/domain/useCases/updateInviteStatus"
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

const makeFakeUpdateInviteData = (): UpdateInviteStatusModel => ({
  id: 'invite_id',
  status: 'any_status',
  userId: 'to_user_id',
})

const makeFakeInviteData = (date): InviteModel => ({
  id: 'invite_id',
  description: 'invite_desc',
  userId: 'from_user_id',
  to: 'to_user_id',
  date: date,
  budgetId: 'budget_id',
  status: 'any_status'
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

  describe('updateStatus', () => {
    test('Should return a true on updateStatus success', async () => {
      const { sut } = makeSUT()

      FirestoreHelper.db.collection('invites').doc('invite_id').set(makeAddInvite(date))
      const invite = await sut.updateStatus(makeFakeUpdateInviteData())

      expect(invite).toEqual(true)
    })

    test('Should return null if not found', async () => {
      const { sut } = makeSUT()

      await FirestoreHelper.getCollection('invites').doc('invite_id').delete()

      const invite = await sut.updateStatus(makeFakeUpdateInviteData())

      expect(invite).toBeNull()
    })

    test('Should return null if to_user_id not found', async () => {
      const { sut } = makeSUT()

      await FirestoreHelper.getCollection('invites').doc('invite_id').delete()
      await FirestoreHelper.getCollection('users').doc('to_user_id').delete()
      const invite = await sut.updateStatus(makeFakeUpdateInviteData())

      expect(invite).toBeNull()
    })
  })

  describe('getAll', () => {
    test('Should return a a list of invites on getAll success', async () => {
      const { sut } = makeSUT()

      FirestoreHelper.db.collection('invites').doc('invite_id').set({ ...makeAddInvite(date), status: 'any_status' })

      const sendedInvites = await sut.getAll('from_user_id')
      expect(sendedInvites).toContainEqual(makeFakeInviteData(date))

      const receivedInvites = await sut.getAll('to_user_id', true)
      expect(receivedInvites).toContainEqual(makeFakeInviteData(date))
    })

    test('Should return an empty array if not found', async () => {
      const { sut } = makeSUT()

      await FirestoreHelper.getCollection('invites').doc('invite_id').delete()

      const sendedInvites = await sut.getAll('from_user_id')
      expect(sendedInvites).toEqual([])

      const receivedInvites = await sut.getAll('to_user_id', true)
      expect(receivedInvites).toEqual([])
    })
  })
})