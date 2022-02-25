import { UserRepository } from "../../../data/interfaces/userRepo"
import { UserModel } from "../../../domain/models"
import { AddUserModel } from "../../../domain/useCases"
import { FirestoreHelper } from "../firestore/helpers/firestoreHelper"

export class UserFirestoreRepo implements UserRepository {
  async add (userData: AddUserModel): Promise<UserModel> {
    const user = FirestoreHelper.getCollection('users').doc()
    const userObject = { id: user.id, ...userData }

    await user.set(userObject)
    
    return new Promise(resolve => resolve(userObject))
  }
}
