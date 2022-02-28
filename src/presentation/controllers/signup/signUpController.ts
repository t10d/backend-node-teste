import { Authentication } from "../../../domain/useCases/authentication"
import { EmailInUseError } from "../../errors"
import { badRequest, forbidden, ok, serverError } from "../../helpers/httpHelpers"
import { AddUser, Controller, HttpRequest, HttpResponse, Validation } from "./interfaces"

export class SignUpController implements Controller {
  constructor (
    private readonly addUser: AddUser, 
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
      }

      const { name, email, password } = httpRequest.body

      const user = await this.addUser.add({
        name, email, password
      })

      if (!user) {
        return forbidden(new EmailInUseError())
      }

      const accessToken = await this.authentication.auth({
        email, password
      })

      return ok({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
