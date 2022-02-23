import { UserModel } from "../../../domain/models"
import { AddUser, AddUserModel } from "../../../domain/useCases"
import { Encrypter } from "../../interfaces/encripter"

export class DbAddUser implements AddUser {
  private readonly encrypter: Encrypter
  constructor (encrypter: Encrypter) {
    this.encrypter = encrypter
  }

  async add (user: AddUserModel): Promise<UserModel> {
    await this.encrypter.encrypt(user.password)
    return new Promise(resolve => resolve(null))
  }
}
