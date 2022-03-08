import { DbGetInvites } from "../../../data/useCases/invite/dbGetInvites"
import { InviteFirestoreRepo } from "../../../infra/db/firestore/inviteFirestoreRepo"
import { GetInvitesController } from "../../../presentation/controllers/invite/getInvitesController"
import { Controller } from "../../../presentation/interfaces"
import { LogControllerDecorator } from "../../decorators/logControllerDecorator"

export const makeGetInvitesController = (): Controller => {
  const inviteFirestoreRepo = new InviteFirestoreRepo()
  const dbGetInvites = new DbGetInvites(inviteFirestoreRepo)
  const getInvitesController = new GetInvitesController(dbGetInvites)
  return new LogControllerDecorator(getInvitesController)
}