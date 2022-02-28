import { makeAddBudgetValidation } from "../../../src/main/factories/budget/makeAddBudgetValidation"
import { RequiredFieldValidation } from "../../../src/presentation/helpers/validators/requiredFieldValidation"
import { ValidationComposite } from "../../../src/presentation/helpers/validators/validatorComposite"
import { Validation } from "../../../src/presentation/interfaces/validation"

jest.mock("../../../src/presentation/helpers/validators/validatorComposite")

describe('BudgetValidation Factory', () => {
  test('Should call Validation with all validations', () => {
    makeAddBudgetValidation()
    const validations: Validation[] = []

    for (const field of ['name', 'totalRealized', 'totalProjected']) {
      validations.push(new RequiredFieldValidation(field))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})