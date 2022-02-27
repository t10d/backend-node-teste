import { Authentication, AuthModel } from "../../../domain/useCases/authentication"
import { LoadUserByEmailRepo } from "../../interfaces/loadUserByEmailRepo";

export class DbAuthentication implements Authentication {
  constructor(private readonly loadUserByEmailRepo: LoadUserByEmailRepo) {}

  async auth(auth: AuthModel): Promise<string> {
    await this.loadUserByEmailRepo.load(auth.email)
    return null
  }
}