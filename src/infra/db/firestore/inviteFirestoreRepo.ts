import { AddInviteRepo } from "../../../data/useCases/invite/interfaces"
import { InviteModel } from "../../../domain/models"
import { AddInviteModel } from "../../../domain/useCases"
import { FirestoreHelper } from "../../helpers/firestoreHelper"

export class InviteFirestoreRepo implements AddInviteRepo {
  async add (inviteData: AddInviteModel): Promise<InviteModel> {
    const invite = FirestoreHelper.getCollection('invites').doc()
    const inviteObject = { id: invite.id, ...inviteData }

    await invite.set(inviteObject)
    
    return new Promise(resolve => resolve(inviteObject))
  }
}