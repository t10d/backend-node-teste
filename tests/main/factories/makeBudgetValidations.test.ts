import { makeBudgetValidation } from "../../../src/main/factories/budget/makeBudgetValidation"
import { RequiredFieldValidation } from "../../../src/presentation/helpers/validators/requiredFieldValidation"
import { ValidationComposite } from "../../../src/presentation/helpers/validators/validatorComposite"
import { Validation } from "../../../src/presentation/interfaces/validation"

jest.mock("../../../src/presentation/helpers/validators/validatorComposite")

describe('BudgetValidation Factory', () => {
  test('Should call Validation with all validations', () => {
    makeBudgetValidation()
    const validations: Validation[] = []

    for (const field of ['name', 'total_realized', 'total_projected']) {
      validations.push(new RequiredFieldValidation(field))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})