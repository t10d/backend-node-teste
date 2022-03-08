import { InviteModel } from "../models/inviteModel"

export interface UpdateInviteStatusModel {
  id: string
  status: string
  userId: string
}

export interface UpdateInviteStatus {
  updateStatus (inviteData: UpdateInviteStatusModel): Promise<boolean>
}