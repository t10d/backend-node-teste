import { AddUserRepository } from "../../../data/interfaces/addUserRepo"
import { UserModel } from "../../../domain/models"
import { AddUserModel } from "../../../domain/useCases"
import { db } from "../firestore/helpers/firestoreHelper"

export class UserFirestoreRepo implements AddUserRepository {
  async add (userData: AddUserModel): Promise<UserModel> {
    const entry = db.collection('users').doc()
    const entryObject = { id: entry.id, ...userData }

    entry.set(entryObject)
    
    return new Promise(resolve => resolve(entryObject))
  }
}
