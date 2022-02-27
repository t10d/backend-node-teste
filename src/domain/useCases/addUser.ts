import { UserModel } from "../models/userModel"

export interface AddUserModel {
  name: string
  email: string
  password: string
}

export interface AddUser {
  add (user: AddUserModel): Promise<UserModel>
}
