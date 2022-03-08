import { GetInvites } from "../../../domain/useCases/GetInvites"
import { GetInvitesRepo } from "../../interfaces/db/invite/getInvitesRepo"
import { InviteModel } from "./interfaces"

export class DbGetInvites implements GetInvites {
  constructor (
    private readonly getInvitesRepo: GetInvitesRepo
  ) {}

  async getAll (userId: string, toMe?: boolean): Promise<InviteModel[]> {
    const expenses = await this.getInvitesRepo.getAll(userId, toMe)
    return new Promise(resolve => resolve(expenses))
  }
}