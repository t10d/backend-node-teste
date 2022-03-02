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
      const error = this.validation.validate(httpRequest.query)

      if (error) {
        return badRequest(error)
      }
      
      const { budgetId } = httpRequest.query
      const { userId } = httpRequest.body

      const expenses = await this.getExpensesByBudget.getByBudget(budgetId, userId)

      return ok(expenses)
    } catch (error) {
      return serverError(error)
    }
  }
}