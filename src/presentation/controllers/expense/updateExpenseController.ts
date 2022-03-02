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
      const request = { 
        id: httpRequest.params.id as string,
        name: httpRequest.body.name as string, 
        category: httpRequest.body.category as string, 
        realized: httpRequest.body.realized as number, 
        projected: httpRequest.body.projected as number, 
        type: httpRequest.body.type as string,
        budgetId: httpRequest.body.budgetId as string
      }

      const error = this.validation.validate(request)

      if (error) {
        return badRequest(error)
      }

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