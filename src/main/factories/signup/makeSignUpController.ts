import { SignUpController } from "../../../presentation/controllers/signup/signUpController";
import { Controller } from "../../../presentation/interfaces";
import { LogControllerDecorator } from "../../decorators/logControllerDecorator";
import { makeDbAddUser } from "../useCases/makeDbAddUser";
import { makeDbAuth } from "../useCases/makeDbAuthentication";
import { makeSignUpValidation } from "./makeSignupValidation";

export const makeSignUpController = (): Controller => {
  const dbAddUser = makeDbAddUser()
  const authentication = makeDbAuth()
  const signUpController = new SignUpController(dbAddUser, makeSignUpValidation(), authentication)
  return new LogControllerDecorator(signUpController)
}