import { AddInvite } from "../../../domain/useCases/addInvite"
import { UserNotFoundError } from "../../errors"
import { badRequest, ok, serverError } from "../../helpers/httpHelpers"
import { Controller, HttpRequest, HttpResponse, Validation } from "./interfaces"

export class AddInviteController implements Controller {
  constructor (
    private readonly addInvite: AddInvite, 
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
      }

      const { description, userId, to, budgetId } = httpRequest.body

      const invite = await this.addInvite.add({
        description, userId, to, date: new Date(), budgetId
      })

      if (!invite) {
        return badRequest(new UserNotFoundError())
      }

      return ok(invite)
    } catch (error) {
      return serverError(error)
    }
  }
}