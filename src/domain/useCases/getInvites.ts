import { InviteModel } from "../models";

export interface GetInvites {
  getAll (userId: string, toMe?: boolean): Promise<InviteModel[]>
}
