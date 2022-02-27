import { badRequest, ok, serverError } from "../../helpers/httpHelpers"
import { AddUser, Controller, HttpRequest, HttpResponse, Validation } from "./interfaces"

export class SignUpController implements Controller {
  constructor (
    private readonly addUser: AddUser, 
    private readonly validation: Validation
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

      return ok(user)
    } catch (error) {
      return serverError(error)
    }
  }
}
