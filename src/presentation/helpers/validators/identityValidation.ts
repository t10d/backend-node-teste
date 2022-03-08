import { IdentityValidationRepo } from "../../../data/interfaces/db/validation/IdentityValidationRepo";
import { UnauthorizedError } from "../../errors/unathorizedError";
import { Validation } from "../../interfaces/validation";

export class IdentityValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly collectionFieldName: string,
    private readonly collectionName: string,
    private readonly collectionFieldId: string,
    private readonly identityValidationRepo: IdentityValidationRepo,
  ) {}

  validate (input: any): Error {
    const isValid = this.identityValidationRepo.validateIdentity(
      input[this.fieldName],
      this.collectionFieldName, 
      this.collectionName,
      this.collectionFieldId
    )
    
    if (isValid) return new UnauthorizedError()
  }
}