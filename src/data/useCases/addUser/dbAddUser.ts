import { Encrypter } from "../../interfaces/security/encripter"
import { UserModel, AddUser, AddUserModel, AddUserRepo } from "./interfaces"

export class DbAddUser implements AddUser {
  private readonly encrypter: Encrypter
  private readonly addUserRepository: AddUserRepo

  constructor (encrypter: Encrypter, addUserRepository: AddUserRepo) {
    this.encrypter = encrypter
    this.addUserRepository = addUserRepository
  }

  async add (userData: AddUserModel): Promise<UserModel> {
    const hashedPassword = await this.encrypter.encrypt(userData.password)
    const user = await this.addUserRepository.add(Object.assign({}, userData, { password: hashedPassword }))
    return new Promise(resolve => resolve(user))
  }
}
