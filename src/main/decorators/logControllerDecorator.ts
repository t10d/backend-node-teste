import { Controller, HttpRequest, HttpResponse } from "../../presentation/interfaces"

export class LogControllerDecorator implements Controller {
  constructor (private readonly controller: Controller) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)
    if (httpResponse.statusCode === 500) {
      console.error(httpResponse.body.stack)
    }
    return httpResponse
  }
}