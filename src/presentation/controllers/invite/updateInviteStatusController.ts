import { UpdateInviteStatus } from "../../../domain/useCases/updateInviteStatus"
import { badRequest, ok, serverError } from "../../helpers/httpHelpers"
import { Controller, HttpRequest, HttpResponse, Validation } from "./interfaces"

export class UpdateInviteStatusController implements Controller {
  constructor (
    private readonly updateInviteStatus: UpdateInviteStatus, 
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = httpRequest.params
      const { status, userId } = httpRequest.body

      const error = this.validation.validate({ id, status })
      
      if (error) {
        return badRequest(error)
      }

      await this.updateInviteStatus.updateStatus({ id, status, userId })

      return ok({ message: 'Invite status updated succesfully' })
    } catch (error) {
      return serverError(error)
    }
  }
}