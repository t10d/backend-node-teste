import { InviteModel, AddInvite, AddInviteModel, AddInviteRepo } from "./interfaces"

export class DbAddInvite implements AddInvite {
  constructor (
    private readonly addInviteRepository: AddInviteRepo
  ) {}

  async add (inviteData: AddInviteModel): Promise<InviteModel> {
    const invite = await this.addInviteRepository.add(inviteData)
    return new Promise(resolve => resolve(invite))
  }
}
