import { Router } from 'express'
import { expressAdapter } from '../adapters/expressAdapter'
import { makeSignUpController } from '../factories/signUp'

export default (router: Router): void => {
  router.post('/signup', expressAdapter(makeSignUpController()))
}