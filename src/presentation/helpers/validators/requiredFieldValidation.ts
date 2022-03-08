import { MissingParamError } from "../../errors";
import { Validation } from "../../interfaces/validation";

export class RequiredFieldValidation implements Validation {
  constructor (private readonly fieldName: string) {}

  validate(input: any): Error {
    if (!(this.fieldName in input)) {
      return new MissingParamError(this.fieldName)
    }
  }
}