import { GetInvites } from "../../../domain/useCases/getInvites"
import { badRequest, ok, serverError } from "../../helpers/httpHelpers"
import { Controller, HttpRequest, HttpResponse } from "./interfaces"

export class GetInvitesController implements Controller {
  constructor (
    private readonly getInvites: GetInvites, 
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { userId } = httpRequest.body

      const toMeString = httpRequest.query ? httpRequest.query.toMe : false
      const toMe = (toMeString === 'true')

      const invites = await this.getInvites.getAll(userId, toMe)

      return ok(invites)
    } catch (error) {
      return serverError(error)
    }
  }
}