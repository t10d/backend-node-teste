import { Router } from "express"
import { expressAdapter } from "../adapters/expressAdapter"
import { makeAddBudgetController } from "../factories/budget/makeAddBudgetController"
import { makeDeleteBudgetController } from "../factories/budget/makeDeleteBudgetController"

export default (router: Router): void => {
  router.post('/budget', expressAdapter(makeAddBudgetController()))
  router.delete('/budget/:id', expressAdapter(makeDeleteBudgetController()))
}
