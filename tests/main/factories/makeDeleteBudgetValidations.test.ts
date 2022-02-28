import { makeDeleteBudgetValidation } from "../../../src/main/factories/budget/makeDeleteBudgetValidation"
import { RequiredFieldValidation } from "../../../src/presentation/helpers/validators/requiredFieldValidation"
import { ValidationComposite } from "../../../src/presentation/helpers/validators/validatorComposite"
import { Validation } from "../../../src/presentation/interfaces/validation"

jest.mock("../../../src/presentation/helpers/validators/validatorComposite")

describe('BudgetValidation Factory', () => {
  test('Should call Validation with all validations', () => {
    makeDeleteBudgetValidation()

    const validations: Validation[] = []
    validations.push(new RequiredFieldValidation('id'))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})