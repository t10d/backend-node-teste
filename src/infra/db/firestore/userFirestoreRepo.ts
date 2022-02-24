import { AddUserRepository } from "../../../data/interfaces/addUserRepo"
import { UserModel } from "../../../domain/models"
import { AddUserModel } from "../../../domain/useCases"

export class UserFirestoreRepo implements AddUserRepository {
  async add (userData: AddUserModel): Promise<UserModel> {
    return new Promise(resolve => resolve(null))
  }
}
