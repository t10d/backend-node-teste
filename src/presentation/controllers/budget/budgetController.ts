import { AddBudget } from "../../../domain/useCases/addBudget"
import { badRequest, ok, serverError } from "../../helpers/httpHelpers"
import { Controller, HttpRequest, HttpResponse, Validation } from "./interfaces"

export class BudgetController implements Controller {
  constructor (
    private readonly addBudget: AddBudget, 
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
      }

      const { name, total_realized, total_projected } = httpRequest.body

      const budget = await this.addBudget.add({
        name, total_realized, total_projected
      })

      return ok(budget)
    } catch (error) {
      return serverError(error)
    }
  }
}