import { UpdateExpense } from "../../../domain/useCases/updateExpense"
import { badRequest, ok, serverError } from "../../helpers/httpHelpers"
import { Controller, HttpRequest, HttpResponse, Validation } from "./interfaces"

export class UpdateExpenseController implements Controller {
  constructor (
    private readonly updateExpense: UpdateExpense, 
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
      }

      const request = httpRequest.body

      // remove undefined values from request
      for (const key in request) {
        if (!request[key]) delete request[key]
      }

      const expense = await this.updateExpense.update(request)

      return ok(expense)
    } catch (error) {
      return serverError(error)
    }
  }
}