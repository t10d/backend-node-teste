import { access } from "fs";
import { GetUserByToken } from "../../domain/useCases/getUserByToken";
import { MissingAuthTokenError } from "../errors/missingAuthTokenError";
import { forbidden, ok } from "../helpers/httpHelpers";
import { HttpRequest, HttpResponse } from "../interfaces";
import { Middleware } from "../interfaces/middleware";

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly getUserByToken: GetUserByToken
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers?.['x-access-token']
    if (accessToken) {
      const user = await this.getUserByToken.getByToken(accessToken)
      if (user) {
        return ok({ userID: user.id })
      }
    }
    
    return forbidden(new MissingAuthTokenError())
  }
}