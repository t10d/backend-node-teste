import { makeSignUpValidation } from "../../../src/main/factories/makeSignupValidation"
import { RequiredFieldValidation } from "../../../src/presentation/helpers/validators/requitedFieldValidation";
import { Validation } from "../../../src/presentation/helpers/validators/validation";
import { ValidationComposite } from "../../../src/presentation/helpers/validators/validatorComposite"

jest.mock("../../../src/presentation/helpers/validators/validatorComposite")

describe('SignUpValidation Factory', () => {
  test('Should call Validation with all validations', () => {
    makeSignUpValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
});