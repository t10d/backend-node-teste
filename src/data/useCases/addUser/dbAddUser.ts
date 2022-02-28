import { Hasher } from "../../interfaces/security/hasher"
import { UserModel, AddUser, AddUserModel, AddUserRepo } from "./interfaces"

export class DbAddUser implements AddUser {
  constructor (
    private readonly hasher: Hasher,
    private readonly addUserRepository: AddUserRepo
  ) {}

  async add (userData: AddUserModel): Promise<UserModel> {
    const hashedPassword = await this.hasher.hash(userData.password)
    const user = this.addUserRepository
    const user = await this.addUserRepository.add(
      Object.assign({}, userData, { password: hashedPassword }))
    return new Promise(resolve => resolve(user))
  }
}
