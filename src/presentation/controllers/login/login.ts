import { InvalidParamError, MissingParamError } from "../../errors"
import { badRequest, ok, serverError } from "../../helpers/http-helpers"
import { Controller, HttpRequest, HttpResponse } from "../../interfaces"
import { EmailValidator } from "./interfaces"

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { email, password } = httpRequest.body

      const isValid = this.emailValidator.isValid(email)

      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      return null
    } catch (error) {
      return serverError(error)
    }
  }
}