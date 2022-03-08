import { AuthController } from "../../../presentation/controllers/auth/authController";
import { Controller } from "../../../presentation/interfaces";
import { LogControllerDecorator } from "../../decorators/logControllerDecorator";
import { makeDbAuth } from "../useCases/makeDbAuthentication";
import { makeAuthValidation } from "./makeAuthValidation";

export const makeAuthController = (): Controller => {
  const dbAuth = makeDbAuth() 
  const authController = new AuthController(dbAuth, makeAuthValidation())
  return new LogControllerDecorator(authController)
}