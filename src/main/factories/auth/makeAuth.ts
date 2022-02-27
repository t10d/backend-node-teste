import { DbAuthentication } from "../../../data/useCases/authentication/dbAuthentication";
import { UserFirestoreRepo } from "../../../infra/db/firestore/userFirestoreRepo";
import { BcriptAdapter } from "../../../infra/security/bcriptAdapter";
import { JWTAdapter } from "../../../infra/security/jwtAdapter";
import { AuthController } from "../../../presentation/controllers/auth/authController";
import { Controller } from "../../../presentation/interfaces";
import env from "../../config/env";
import { LogControllerDecorator } from "../../decorators/logControllerDecorator";
import { makeAuthValidation } from "./makeAuthValidation";

export const makeAuthController = (): Controller => {
  const salt = 12
  const bcriptAdapter = new BcriptAdapter(salt)
  const jwtAdapter = new JWTAdapter(env.jwtSecret)
  const userFirestoreRepo = new UserFirestoreRepo()
  const dbAuth = new DbAuthentication(userFirestoreRepo, bcriptAdapter, jwtAdapter, userFirestoreRepo) 
  const authController = new AuthController(dbAuth, makeAuthValidation())
  return new LogControllerDecorator(authController)
}