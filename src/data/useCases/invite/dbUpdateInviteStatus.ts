import { UpdateInviteStatus, UpdateInviteStatusModel } from "../../../domain/useCases/updateInviteStatus"
import { UpdateInviteStatusRepo } from "../../interfaces/db/invite/updateInviteStatusRepo"
import { InviteModel } from "./interfaces"

export class DbUpdateInviteStatus implements UpdateInviteStatus {
  constructor (
    private readonly updateInviteStatusRepository: UpdateInviteStatusRepo
  ) {}

  async updateStatus (inviteData: UpdateInviteStatusModel): Promise<boolean> {
    const result = await this.updateInviteStatusRepository.updateStatus(inviteData)
    return new Promise(resolve => resolve(result))
  }
}