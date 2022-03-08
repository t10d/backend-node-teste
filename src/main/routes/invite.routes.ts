import { Router } from "express"
import { expressAdapter } from "../adapters/expressAdapter"
import { expressMiddlewareAdapter } from "../adapters/expressMiddlewareAdapter"
import { makeAddInviteController } from "../factories/invite/makeAddInviteController"
import { makeDeleteInviteController } from "../factories/invite/makeDeleteInviteController"
import { makeGetInvitesController } from "../factories/invite/makeGetInvitesController"
import { makeUpdateInviteStatusController } from "../factories/invite/makeUpdateInviteStatusController"
import { makeAuthMiddleware } from "../factories/middlewares/makeAuthMiddleware"

export default (router: Router): void => {
  const userAuth = expressMiddlewareAdapter(makeAuthMiddleware('user'))
  router.post('/invite', userAuth, expressAdapter(makeAddInviteController()))
  router.delete('/invite/:id', userAuth, expressAdapter(makeDeleteInviteController()))
  router.patch('/invite_status/:id', userAuth, expressAdapter(makeUpdateInviteStatusController()))
  router.get('/invites', userAuth, expressAdapter(makeGetInvitesController()))
}
