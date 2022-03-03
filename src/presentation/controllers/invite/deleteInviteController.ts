import { DeleteInvite } from "../../../domain/useCases/deleteInvite"
import { badRequest, ok, serverError } from "../../helpers/httpHelpers"
import { Controller, HttpRequest, HttpResponse, Validation } from "./interfaces"

export class DeleteInviteController implements Controller {
  constructor (
    private readonly deleteInvite: DeleteInvite, 
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.params)

      if (error) {
        return badRequest(error)
      }

      const { id } = httpRequest.params

      await this.deleteInvite.delete(id)

      return ok(true)
    } catch (error) {
      return serverError(error)
    }
  }
}