import { Router } from "express"
import { expressAdapter } from "../adapters/expressAdapter"
import { makeAddExpenseController } from "../factories/expense/makeAddExpenseController"

export default (router: Router): void => {
  router.post('/expense', expressAdapter(makeAddExpenseController()))
}
