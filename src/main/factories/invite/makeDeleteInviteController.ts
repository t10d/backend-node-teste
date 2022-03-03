import { DbDeleteInvite } from "../../../data/useCases/invite/dbDeleteInvite"
import { InviteFirestoreRepo } from "../../../infra/db/firestore/inviteFirestoreRepo"
import { DeleteInviteController } from "../../../presentation/controllers/invite/DeleteInviteController"
import { Controller } from "../../../presentation/interfaces"
import { LogControllerDecorator } from "../../decorators/logControllerDecorator"
import { makeDeleteInviteValidation } from "./makeDeleteInviteValidation"

export const makeDeleteInviteController = (): Controller => {
  const inviteFirestoreRepo = new InviteFirestoreRepo()
  const dbDeleteInvite = new DbDeleteInvite(inviteFirestoreRepo)
  const deleteInviteController = new DeleteInviteController(dbDeleteInvite, makeDeleteInviteValidation())
  return new LogControllerDecorator(deleteInviteController)
}