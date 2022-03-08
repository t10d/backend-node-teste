import { Router } from "express"
import { expressAdapter } from "../adapters/expressAdapter"
import { expressMiddlewareAdapter } from "../adapters/expressMiddlewareAdapter"
import { makeAddExpenseController } from "../factories/expense/makeAddExpenseController"
import { makeGetExpensesByBudgetController } from "../factories/expense/makeGetExpensesByBudgetController"
import { makeUpdateExpenseController } from "../factories/expense/makeUpdateExpenseController"
import { makeAuthMiddleware } from "../factories/middlewares/makeAuthMiddleware"

export default (router: Router): void => {
  const userAuth = expressMiddlewareAdapter(makeAuthMiddleware('user'))
  router.post('/expense', userAuth, expressAdapter(makeAddExpenseController()))
  router.get('/expenses', userAuth, expressAdapter(makeGetExpensesByBudgetController()))
  router.put('/expense/:id', userAuth, expressAdapter(makeUpdateExpenseController()))
}
