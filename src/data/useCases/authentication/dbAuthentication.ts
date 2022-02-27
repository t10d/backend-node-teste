import { Authentication, AuthModel } from "../../../domain/useCases/authentication"
import { LoadUserByEmailRepo } from "../../interfaces/loadUserByEmailRepo";
import { HashComparer } from "../../interfaces/security/hashComparer";

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadUserByEmailRepo: LoadUserByEmailRepo,
    private readonly hashComparer: HashComparer
  ) {}

  async auth(auth: AuthModel): Promise<string> {
    const user = await this.loadUserByEmailRepo.load(auth.email)
    if (user) {
      await this.hashComparer.compare(auth.password, user.password)
    }

    return null
  }
}