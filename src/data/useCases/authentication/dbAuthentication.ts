import { Encrypter } from "../../interfaces/security/Encrypter"
import { Authentication, AuthModel } from "./interfaces"
import { GetUserByEmailRepo, HashComparer, UpdateAccessTokenRepo } from "./interfaces"

export class DbAuthentication implements Authentication {
  constructor(
    private readonly getUserByEmailRepo: GetUserByEmailRepo,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepo: UpdateAccessTokenRepo
  ) {}

  async auth(auth: AuthModel): Promise<string> {
    const user = await this.getUserByEmailRepo.getByEmail(auth.email)
    if (user) {
      const comparerResult = await this.hashComparer.compare(auth.password, user.password)
      if (comparerResult) {
        const accessToken = await this.encrypter.encrypt(user.id)
        await this.updateAccessTokenRepo.updateAccessToken(user.id, accessToken)
        return accessToken
      }
    }
    return null
  }
}