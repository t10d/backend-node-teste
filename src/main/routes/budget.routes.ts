import { Router } from "express"
import { expressAdapter } from "../adapters/expressAdapter"
import { expressMiddlewareAdapter } from "../adapters/expressMiddlewareAdapter copy"
import { makeAddBudgetController } from "../factories/budget/makeAddBudgetController"
import { makeDeleteBudgetController } from "../factories/budget/makeDeleteBudgetController"
import { makeAuthMiddleware } from "../factories/middlewares/makeAuthMiddleware"

export default (router: Router): void => {
  const userAuth = expressMiddlewareAdapter(makeAuthMiddleware('user'))
  router.post('/budget', userAuth, expressAdapter(makeAddBudgetController()))
  router.delete('/budget/:id', userAuth, expressAdapter(makeDeleteBudgetController()))
}
