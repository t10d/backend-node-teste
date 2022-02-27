import { Authentication } from "../../../domain/useCases/authentication"
import { badRequest, ok, serverError, unauthorized } from "../../helpers/httpHelpers"
import { Controller, HttpRequest, HttpResponse } from "../../interfaces"
import { Validation } from "../../interfaces/validation"

export class AuthController implements Controller {
  constructor (
    private readonly authentication: Authentication,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
      }

      const { email, password } = httpRequest.body

      const accessToken = await this.authentication.auth({ email, password })

      if (!accessToken) {
        return unauthorized()
      }

      return ok({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}