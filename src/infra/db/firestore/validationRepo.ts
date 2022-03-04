import { IdentityValidationRepo } from "../../../data/interfaces/db/validation/IdentityValidationRepo"
import { FirestoreHelper } from "../../helpers/firestoreHelper"

export class ValidationRepo implements IdentityValidationRepo {
  async validateIdentity (fieldValue: string, colFieldName: string, colName: string, colFieldId: string): Promise<boolean> {
    const snap = await FirestoreHelper.getCollection(colName).doc(colFieldId).get()

    if (snap.exists) {
      if (snap.get(colFieldName) === fieldValue) return new Promise(resolve => resolve(true))
    }
    
    return new Promise(resolve => resolve(false))
  }
}