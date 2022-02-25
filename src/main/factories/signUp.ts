import { DbAddUser } from "../../data/useCases/addUser/dbAddUser";
import { UserFirestoreRepo } from "../../infra/db/firestore/userFirestoreRepo";
import { BcriptAdapter } from "../../infra/security/bcriptAdapter";
import { SignUpController } from "../../presentation/controllers/signup/signUp";
import { Controller } from "../../presentation/interfaces";
import { EmailValidatorAdapter } from "../../utils/emailValidatorAdapter";
import { LogControllerDecorator } from "../decorators/logControllerDecorator";

export const makeSignUpController = (): Controller => {
  const salt = 12
  const encrypter = new BcriptAdapter(salt)
  const userFirestoreRepo = new UserFirestoreRepo()
  const dbAddUser = new DbAddUser(encrypter, userFirestoreRepo)
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const signUpController = new SignUpController(emailValidatorAdapter, dbAddUser)
  return new LogControllerDecorator(signUpController)
}