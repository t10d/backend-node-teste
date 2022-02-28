import { GetUserByToken } from "../../../domain/useCases/getUserByToken";
import { Decrypter } from "../../interfaces/security/decrypter";
import { UserModel } from "../budget/interfaces";

export class DbGetUserByToken implements GetUserByToken {
  constructor(
    private readonly decrypter: Decrypter
  ) {}
  
  async getByToken(accessToken: string, role?: string): Promise<UserModel> {
    const decryptedValue = await this.decrypter.decrypt(accessToken)
    return new Promise(resolve => resolve(null))
  }
}