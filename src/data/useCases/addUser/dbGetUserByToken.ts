import { GetUserByToken } from "../../../domain/useCases/getUserByToken";
import { Decrypter } from "../../interfaces/security/decrypter";
import { UserModel } from "../budget/interfaces";

export class DbGetUserByToken implements GetUserByToken {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly getUserByTokenRepo: GetUserByToken
  ) {}
  
  async getByToken(accessToken: string, role?: string): Promise<UserModel> {
    const decryptedToken = await this.decrypter.decrypt(accessToken)
    if (decryptedToken) {
      await this.getUserByTokenRepo.getByToken(accessToken, role)
    }
    return null
  }
}