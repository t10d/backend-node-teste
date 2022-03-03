import { DeleteInvite } from "../../../domain/useCases/deleteInvite"
import { DeleteInviteRepo } from "../../interfaces/db/invite/deleteInviteRepo"

export class DbDeleteInvite implements DeleteInvite {
  constructor (
    private readonly deleteInviteRepository: DeleteInviteRepo
  ) {}

  async delete (id: string): Promise<string> {
    const inviteId = await this.deleteInviteRepository.delete(id)
    return new Promise(resolve => resolve(inviteId))
  }
}