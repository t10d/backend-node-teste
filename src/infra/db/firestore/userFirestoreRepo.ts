import { AddUserRepository } from "../../../data/interfaces/addUserRepo"
import { UserModel } from "../../../domain/models"
import { AddUserModel } from "../../../domain/useCases"
import { FirestoreHelper } from "../firestore/helpers/firestoreHelper"

export class UserFirestoreRepo implements AddUserRepository {
  async add (userData: AddUserModel): Promise<UserModel> {
    const user = FirestoreHelper.getCollection('users').doc()
    const userObject = { id: user.id, ...userData }

    await user.set(userObject)
    
    return new Promise(resolve => resolve(userObject))
  }
}
