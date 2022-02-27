import { DbAddUser } from "../../../data/useCases/addUser/dbAddUser";
import { UserFirestoreRepo } from "../../../infra/db/firestore/userFirestoreRepo";
import { BcriptAdapter } from "../../../infra/security/bcriptAdapter";
import { SignUpController } from "../../../presentation/controllers/signup/signUpController";
import { Controller } from "../../../presentation/interfaces";
import { LogControllerDecorator } from "../../decorators/logControllerDecorator";
import { makeSignUpValidation } from "./makeSignupValidation";

export const makeSignUpController = (): Controller => {
  const salt = 12
  const hasher = new BcriptAdapter(salt)
  const userFirestoreRepo = new UserFirestoreRepo()
  const dbAddUser = new DbAddUser(hasher, userFirestoreRepo)
  const signUpController = new SignUpController(dbAddUser, makeSignUpValidation())
  return new LogControllerDecorator(signUpController)
}