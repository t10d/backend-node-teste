import { Middleware } from "../../../presentation/interfaces/middleware"
import { AuthMiddleware } from "../../../presentation/middlewares/authMiddleware"
import { makeDbGetUserByToken } from "../useCases/makeDbGetUserByToken"

export const makeAuthMiddleware = (role?: string): Middleware => {
  const getUserByToken = makeDbGetUserByToken()
  return new AuthMiddleware(getUserByToken)
}