import { makeAddExpenseValidation } from "../../../src/main/factories/expense/makeAddExpenseValidation"
import { RequiredFieldValidation } from "../../../src/presentation/helpers/validators/requiredFieldValidation"
import { ValidationComposite } from "../../../src/presentation/helpers/validators/validatorComposite"
import { Validation } from "../../../src/presentation/interfaces/validation"

jest.mock("../../../src/presentation/helpers/validators/validatorComposite")

describe('ExpenseValidation Factory', () => {
  test('Should call Validation with all validations', () => {
    makeAddExpenseValidation()
    const validations: Validation[] = []

    for (const field of ["id", "name", "category", "realized", "projected", "type", "budgetId"]) {
      validations.push(new RequiredFieldValidation(field))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})