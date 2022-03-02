import { access } from "fs";
import { GetUserByToken } from "../../domain/useCases/getUserByToken";
import { MissingAuthTokenError } from "../errors/missingAuthTokenError";
import { forbidden, ok, serverError } from "../helpers/httpHelpers";
import { HttpRequest, HttpResponse } from "../interfaces";
import { Middleware } from "../interfaces/middleware";

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly getUserByToken: GetUserByToken,
    private readonly role?: string
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token']
      if (accessToken) {
        const user = await this.getUserByToken.getByToken(accessToken, this.role)
        if (user) {
          return ok({ userId: user.id })
        }
      }
      return forbidden(new MissingAuthTokenError())
    } catch (error) {
      return serverError(error)
    }
  }
}