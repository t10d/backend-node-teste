import { Hasher } from "../../interfaces/security/hasher"
import { GetUserByEmailRepo } from "../authentication/interfaces"
import { UserModel, AddUser, AddUserModel, AddUserRepo } from "./interfaces"

export class DbAddUser implements AddUser {
  constructor (
    private readonly hasher: Hasher,
    private readonly addUserRepository: AddUserRepo,
    private readonly getUserByEmailRepo: GetUserByEmailRepo
  ) {}

  async add (userData: AddUserModel): Promise<UserModel> {
    const findUser = await this.getUserByEmailRepo.getByEmail(userData.email)
    if (!findUser) {
      const hashedPassword = await this.hasher.hash(userData.password)
      const user = await this.addUserRepository.add(
        Object.assign({}, userData, { password: hashedPassword }))
      return new Promise(resolve => resolve(user))
    }
    return null
  }
}
