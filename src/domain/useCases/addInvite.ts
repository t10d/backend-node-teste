import { InviteModel } from "../models/inviteModel"

export interface AddInviteModel {
  description?: string,
  userId?: string,
  to: string,
  budgetId: string,
  date?: Date
}

export interface AddInvite {
  add (invite: AddInviteModel): Promise<InviteModel>
}
