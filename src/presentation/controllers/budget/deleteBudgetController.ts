import { DeleteBudget } from "../../../domain/useCases/deleteBudget"
import { badRequest, ok, serverError } from "../../helpers/httpHelpers"
import { Controller, HttpRequest, HttpResponse, Validation } from "./interfaces"

export class DeleteBudgetController implements Controller {
  constructor (
    private readonly deleteBudget: DeleteBudget, 
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.params)

      if (error) {
        return badRequest(error)
      }

      const { id } = httpRequest.params

      await this.deleteBudget.deleteById(id)

      return ok()
    } catch (error) {
      return serverError(error)
    }
  }
}