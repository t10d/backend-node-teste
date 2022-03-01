import { InviteModel } from "../../../../domain/models"
import { AddInviteModel } from "../../../../domain/useCases"

export interface AddInviteRepo {
  add (inviteData: AddInviteModel): Promise<InviteModel>
}
