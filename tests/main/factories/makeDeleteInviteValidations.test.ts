import { makeDeleteInviteValidation } from "../../../src/main/factories/invite/makeDeleteInviteValidation"
import { RequiredFieldValidation } from "../../../src/presentation/helpers/validators/requiredFieldValidation"
import { ValidationComposite } from "../../../src/presentation/helpers/validators/validatorComposite"
import { Validation } from "../../../src/presentation/interfaces/validation"

jest.mock("../../../src/presentation/helpers/validators/validatorComposite")

describe('InviteValidation Factory', () => {
  test('Should call Validation with all validations', () => {
    makeDeleteInviteValidation()

    const validations: Validation[] = []
    validations.push(new RequiredFieldValidation('id'))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})