import { UpdateInviteStatusRepo } from "../../../data/interfaces/db/invite/updateInviteStatusRepo"
import { AddInviteRepo } from "../../../data/interfaces/db/invite/addInviteRepo"
import { InviteModel } from "../../../domain/models"
import { AddInviteModel } from "../../../domain/useCases"
import { FirestoreHelper } from "../../helpers/firestoreHelper"
import { DeleteInviteRepo } from "../../../data/interfaces/db/invite/deleteInviteRepo"
import { UpdateInviteStatusModel } from "../../../domain/useCases/updateInviteStatus"
import { GetInvites } from "../../../domain/useCases/GetInvites"

export class InviteFirestoreRepo implements AddInviteRepo, DeleteInviteRepo, UpdateInviteStatusRepo, GetInvites {
  async add (inviteData: AddInviteModel): Promise<InviteModel> {
    const usersnap = await FirestoreHelper.getCollection('users').doc(inviteData.to).get()
    if (usersnap.exists) {
      const invite = FirestoreHelper.getCollection('invites').doc()
      const inviteObject = { id: invite.id, status: 'pending', ...inviteData }

      await invite.set(inviteObject)
      
      return new Promise(resolve => resolve(inviteObject))
    }
    return null
  }

  async delete(id: string): Promise<string> {
    const inviteRef = FirestoreHelper.getCollection('invites').doc(id)

    if ((await inviteRef.get()).exists) await inviteRef.delete()

    return new Promise(resolve => resolve(null))
  }

  async updateStatus(inviteData: UpdateInviteStatusModel): Promise<boolean> {
    const inviteRef = FirestoreHelper.getCollection('invites').doc(inviteData.id)
    const inviteSnap = await inviteRef.get()

    if (inviteSnap.exists) {
      if (inviteSnap.get('to') !== inviteData.userId) return null
      inviteRef.update({ status: inviteData.status })
      return true
    }
    
    return null
  }

  async getAll(userId: string, toMe?: boolean): Promise<InviteModel[]> {
    const inviteRef = await FirestoreHelper.getCollection('invites').where(toMe ? 'to' : 'userId', '==', userId).get()

    if (!inviteRef.empty) {
      const invites = inviteRef.docs.map((ref: FirebaseFirestore.QueryDocumentSnapshot) => { 
        return ref.data() 
      })
      
      return invites as InviteModel[]
    }

    return []
  }
}
