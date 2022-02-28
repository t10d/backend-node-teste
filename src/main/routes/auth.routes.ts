import { Router } from 'express'
import { expressAdapter } from '../adapters/expressAdapter'
import { makeAuthController } from '../factories/auth/makeAuthController'
import { makeSignUpController } from '../factories/signup/makeSignUpController'

export default (router: Router): void => {
  router.post('/signup', expressAdapter(makeSignUpController()))
  router.post('/auth', expressAdapter(makeAuthController()))
}