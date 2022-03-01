import { DbAddInvite } from "../../../data/useCases/invite/dbAddInvite"
import { InviteFirestoreRepo } from "../../../infra/db/firestore/inviteFirestoreRepo"
import { AddInviteController } from "../../../presentation/controllers/invite/AddInviteController"
import { Controller } from "../../../presentation/interfaces"
import { LogControllerDecorator } from "../../decorators/logControllerDecorator"
import { makeAddInviteValidation } from "./makeAddInviteValidation"

export const makeAddInviteController = (): Controller => {
  const inviteFirestoreRepo = new InviteFirestoreRepo()
  const dbAddInvite = new DbAddInvite(inviteFirestoreRepo)
  const addInviteController = new AddInviteController(dbAddInvite, makeAddInviteValidation())
  return new LogControllerDecorator(addInviteController)
}