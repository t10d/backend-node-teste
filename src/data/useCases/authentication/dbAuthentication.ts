import { Authentication, AuthModel } from "../../../domain/useCases/authentication"
import { LoadUserByEmailRepo } from "../../interfaces/loadUserByEmailRepo";
import { HashComparer } from "../../interfaces/security/hashComparer";
import { TokenGenerator } from "../../interfaces/security/tokenGenerator";

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadUserByEmailRepo: LoadUserByEmailRepo,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator
  ) {}

  async auth(auth: AuthModel): Promise<string> {
    const user = await this.loadUserByEmailRepo.load(auth.email)
    if (user) {
      const comparerResult = await this.hashComparer.compare(auth.password, user.password)
      if (comparerResult) {
        const accessToken = await this.tokenGenerator.generate(user.id)
        return accessToken
      }
    }
    return null
  }
}