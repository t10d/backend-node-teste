import { Authentication, AuthModel } from "./interfaces"
import { GetUserByEmailRepo, HashComparer, TokenGenerator, UpdateAccessTokenRepo } from "./interfaces"

export class DbAuthentication implements Authentication {
  constructor(
    private readonly getUserByEmailRepo: GetUserByEmailRepo,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator,
    private readonly updateAccessTokenRepo: UpdateAccessTokenRepo
  ) {}

  async auth(auth: AuthModel): Promise<string> {
    const user = await this.getUserByEmailRepo.loadByEmail(auth.email)
    if (user) {
      const comparerResult = await this.hashComparer.compare(auth.password, user.password)
      if (comparerResult) {
        const accessToken = await this.tokenGenerator.generate(user.id)
        await this.updateAccessTokenRepo.update(user.id, accessToken)
        return accessToken
      }
    }
    return null
  }
}