import { InviteModel } from "../../../../domain/models";

export interface GetInvitesRepo {
  getAll (userId: string, toMe?: boolean): Promise<InviteModel[]> 
}