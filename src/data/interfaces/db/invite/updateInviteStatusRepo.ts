import { InviteModel } from "../../../../domain/models";
import { UpdateInviteStatusModel } from "../../../../domain/useCases/updateInviteStatus";

export interface UpdateInviteStatusRepo {
  updateStatus (inviteData: UpdateInviteStatusModel): Promise<boolean> 
}