import { AddInviteRepo } from "../../../data/useCases/invite/interfaces"
import { InviteModel } from "../../../domain/models"
import { AddInviteModel } from "../../../domain/useCases"
import { DeleteInvite } from "../../../domain/useCases/deleteInvite"
import { FirestoreHelper } from "../../helpers/firestoreHelper"

export class InviteFirestoreRepo implements AddInviteRepo, DeleteInvite {
  async add (inviteData: AddInviteModel): Promise<InviteModel> {
    const usersnap = await FirestoreHelper.getCollection('users').doc(inviteData.to).get()
    if (usersnap.exists) {
      const invite = FirestoreHelper.getCollection('invites').doc()
      const inviteObject = { id: invite.id, approved: false, ...inviteData }

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
}
