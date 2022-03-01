import { InviteModel } from "../models/inviteModel"

export interface AddInviteModel {
  description?: string,
  from?: string,
  to: string,
  date: Date,
  budgetId: string
}

export interface AddInvite {
  add (invite: AddInviteModel): Promise<InviteModel>
}
