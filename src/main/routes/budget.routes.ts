import { Router } from "express"
import { expressAdapter } from "../adapters/expressAdapter"
import { makeAddBudgetController } from "../factories/budget/makeAddBudgetController"

export default (router: Router): void => {
  router.post('/budget', expressAdapter(makeAddBudgetController()))
}
