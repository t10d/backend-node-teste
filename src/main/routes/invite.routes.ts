import { Router } from "express"
import { expressAdapter } from "../adapters/expressAdapter"
import { expressMiddlewareAdapter } from "../adapters/expressMiddlewareAdapter"
import { makeAddInviteController } from "../factories/invite/makeAddInviteController"
import { makeAuthMiddleware } from "../factories/middlewares/makeAuthMiddleware"

export default (router: Router): void => {
  const userAuth = expressMiddlewareAdapter(makeAuthMiddleware('user'))
  router.post('/invite', userAuth, expressAdapter(makeAddInviteController()))
}
