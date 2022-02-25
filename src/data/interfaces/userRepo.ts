import { UserModel } from "../../domain/models"
import { AddUserModel } from "../../domain/useCases"

export interface UserRepository {
  add (userData: AddUserModel): Promise<UserModel>
}
