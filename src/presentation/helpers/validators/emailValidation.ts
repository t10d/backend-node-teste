import { InvalidParamError } from "../../errors";
import { EmailValidator } from "../../interfaces/emailValidator";
import { Validation } from "../../interfaces/validation";

export class EmailValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator
  ) {}

  validate(input: any): Error {
    if (!this.emailValidator.isValid(input[this.fieldName])) {
      return new InvalidParamError(this.fieldName)
    }
  }
}