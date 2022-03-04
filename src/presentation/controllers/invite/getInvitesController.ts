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
      const toMe = httpRequest.query ? httpRequest.query.toMe : undefined

      const invites = await this.getInvites.getAll(userId, toMe)

      return ok(invites)
    } catch (error) {
      console.error(error)
      return serverError(error)
    }
  }
}