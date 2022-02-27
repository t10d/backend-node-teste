import { UserModel } from "../../domain/models"
import { AddUserModel } from "../../domain/useCases"

export interface AddUserRepo {
  add (userData: AddUserModel): Promise<UserModel>
}
