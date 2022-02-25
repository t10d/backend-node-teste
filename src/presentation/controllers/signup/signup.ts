import { InvalidParamError, MissingParamError } from "../../errors"
import { badRequest, ok, serverError } from "../../helpers/http-helpers"
import { EmailValidator, AddUser, Controller, HttpRequest, HttpResponse } from "./interfaces"

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addUser: AddUser

  constructor (emailValidator: EmailValidator, addUser: AddUser) {
    this.emailValidator = emailValidator
    this.addUser = addUser
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const isValid = this.emailValidator.isValid(email)

      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const user = await this.addUser.add({
        name, email, password
      })

      return ok(user)
    } catch (error) {
      return serverError(error)
    }
  }
}
