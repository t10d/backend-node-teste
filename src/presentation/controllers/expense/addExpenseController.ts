import { AddExpense } from "../../../domain/useCases/addExpense"
import { badRequest, ok, serverError } from "../../helpers/httpHelpers"
import { Controller, HttpRequest, HttpResponse, Validation } from "./interfaces"

export class AddExpenseController implements Controller {
  constructor (
    private readonly addExpense: AddExpense, 
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
      }

      const { name, category, realized, projected, type, budgetId } = httpRequest.body

      const expense = await this.addExpense.add({
        name, category, realized, projected, type, budgetId
      })

      return ok(expense)
    } catch (error) {
      return serverError(error)
    }
  }
}