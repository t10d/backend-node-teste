import { makeUpdateInviteStatusValidation } from "../../../src/main/factories/invite/makeUpdateInviteStatusValidation"
import { RequiredFieldValidation } from "../../../src/presentation/helpers/validators/requiredFieldValidation"
import { ValidationComposite } from "../../../src/presentation/helpers/validators/validatorComposite"
import { Validation } from "../../../src/presentation/interfaces/validation"

jest.mock("../../../src/presentation/helpers/validators/validatorComposite")

describe('UpdateStatusValidation Factory', () => {
  test('Should call Validation with all validations', () => {
    makeUpdateInviteStatusValidation()
    const validations: Validation[] = []

    for (const field of ["id", "status"]) {
      validations.push(new RequiredFieldValidation(field))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})