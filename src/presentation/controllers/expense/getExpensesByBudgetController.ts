import { GetExpensesByBudget } from "../../../domain/useCases/GetExpensesByBudget"
import { badRequest, ok, serverError } from "../../helpers/httpHelpers"
import { Controller, HttpRequest, HttpResponse, Validation } from "./interfaces"

export class GetExpensesByBudgetController implements Controller {
  constructor (
    private readonly getExpensesByBudget: GetExpensesByBudget, 
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.params)

      if (error) {
        return badRequest(error)
      }

      const { id } = httpRequest.params

      const expenses = await this.getExpensesByBudget.getByBudget(id)

      return ok(expenses)
    } catch (error) {
      return serverError(error)
    }
  }
}