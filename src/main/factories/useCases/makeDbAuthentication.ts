import { DbAuthentication } from "../../../data/useCases/authentication/dbAuthentication"
import { Authentication } from "../../../domain/useCases/authentication"
import { UserFirestoreRepo } from "../../../infra/db/firestore/userFirestoreRepo"
import { BcriptAdapter } from "../../../infra/security/bcriptAdapter"
import { JWTAdapter } from "../../../infra/security/jwtAdapter"
import env from "../../config/env"

export const makeDbAuth = (): Authentication => {
  const salt = 12
  const bcriptAdapter = new BcriptAdapter(salt)
  const jwtAdapter = new JWTAdapter(env.jwtSecret)
  const userFirestoreRepo = new UserFirestoreRepo()
  return new DbAuthentication(userFirestoreRepo, bcriptAdapter, jwtAdapter, userFirestoreRepo) 
}