import { makeAddInviteValidation } from "../../../src/main/factories/invite/makeAddInviteValidation"
import { RequiredFieldValidation } from "../../../src/presentation/helpers/validators/requiredFieldValidation"
import { ValidationComposite } from "../../../src/presentation/helpers/validators/validatorComposite"
import { Validation } from "../../../src/presentation/interfaces/validation"

jest.mock("../../../src/presentation/helpers/validators/validatorComposite")

describe('InviteValidation Factory', () => {
  test('Should call Validation with all validations', () => {
    makeAddInviteValidation()
    const validations: Validation[] = []

    for (const field of ['description', 'to', 'date', 'inviteId']) {
      validations.push(new RequiredFieldValidation(field))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})