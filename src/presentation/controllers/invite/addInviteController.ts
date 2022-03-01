import { AddInvite } from "../../../domain/useCases/addInvite"
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

      const { description, from, to, date, budgetId } = httpRequest.body

      const invite = await this.addInvite.add({
        description, from, to, date, budgetId
      })

      return ok(invite)
    } catch (error) {
      return serverError(error)
    }
  }
}