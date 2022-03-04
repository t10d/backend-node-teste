import { DbUpdateInviteStatus } from "../../../data/useCases/invite/dbUpdateInviteStatus"
import { InviteFirestoreRepo } from "../../../infra/db/firestore/inviteFirestoreRepo"
import { UpdateInviteStatusController } from "../../../presentation/controllers/invite/UpdateInviteStatusController"
import { Controller } from "../../../presentation/interfaces"
import { LogControllerDecorator } from "../../decorators/logControllerDecorator"
import { makeUpdateInviteStatusValidation } from "./makeUpdateInviteStatusValidation"

export const makeUpdateInviteStatusController = (): Controller => {
  const inviteStatusFirestoreRepo = new InviteFirestoreRepo()
  const dbUpdateInviteStatus = new DbUpdateInviteStatus(inviteStatusFirestoreRepo)
  const updateInviteStatusController = new UpdateInviteStatusController(dbUpdateInviteStatus, makeUpdateInviteStatusValidation())
  return new LogControllerDecorator(updateInviteStatusController)
}