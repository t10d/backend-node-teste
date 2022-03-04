export interface IdentityValidationRepo {
  validateIdentity (fieldValue: string, colFieldName: string, colName: string, colFieldId: string): Promise<boolean>
}