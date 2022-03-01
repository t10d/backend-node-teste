import { DbGetUserByToken } from "../../../data/useCases/addUser/dbGetUserByToken"
import { GetUserByToken } from "../../../domain/useCases/getUserByToken"
import { UserFirestoreRepo } from "../../../infra/db/firestore/userFirestoreRepo"
import { JWTAdapter } from "../../../infra/security/jwtAdapter"
import env from "../../config/env"

export const makeDbGetUserByToken = (): GetUserByToken => {
  const jwtAdapter = new JWTAdapter(env.jwtSecret)
  const userFirestoreRepo = new UserFirestoreRepo()
  return new DbGetUserByToken(jwtAdapter, userFirestoreRepo) 
}