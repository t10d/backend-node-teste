import { MissingParamError } from "../../errors"
import { badRequest, ok, serverError } from "../../helpers/http-helpers"
import { Controller, HttpRequest, HttpResponse } from "../../interfaces"

export class LoginController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { name, email } = httpRequest.body

      return null
    } catch (error) {
      return serverError(error)
    }
  }
}