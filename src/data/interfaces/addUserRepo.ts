import { UserModel } from "../../domain/models"
import { AddUserModel } from "../../domain/useCases"

export interface AddUserRepository {
  add (userData: AddUserModel): Promise<UserModel>
}
