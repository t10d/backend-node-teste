import { AddBudget } from "../../../domain/useCases/addBudget"
import { badRequest, ok, serverError } from "../../helpers/httpHelpers"
import { Controller, HttpRequest, HttpResponse, Validation } from "./interfaces"

export class AddBudgetController implements Controller {
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

      const { name, totalRealized, totalProjected, userId } = httpRequest.body

      const budget = await this.addBudget.add({
        name, totalRealized, totalProjected, userId
      })

      return ok(budget)
    } catch (error) {
      return serverError(error)
    }
  }
}