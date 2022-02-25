import { DbAddUser } from "../../data/useCases/addUser/dbAddUser";
import { UserFirestoreRepo } from "../../infra/db/firestore/userFirestoreRepo";
import { BcriptAdapter } from "../../infra/security/bcriptAdapter";
import { SignUpController } from "../../presentation/controllers/signup/signUp";
import { EmailValidatorAdapter } from "../../utils/email-validator-adapter";

export const makeSignUpController = (): SignUpController => {
  const salt = 12
  const encrypter = new BcriptAdapter(salt)
  const userFirestoreRepo = new UserFirestoreRepo()
  const dbAddUser = new DbAddUser(encrypter, userFirestoreRepo)
  const emailValidatorAdapter = new EmailValidatorAdapter()
  return new SignUpController(emailValidatorAdapter, dbAddUser)
}