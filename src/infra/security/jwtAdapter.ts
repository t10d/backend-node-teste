import jwt from 'jsonwebtoken'
import { Encrypter } from "../../data/interfaces/security/Encrypter";

export class JWTAdapter implements Encrypter {
  constructor (private readonly secret: string) {}

  async encrypt(value: string): Promise<string> {
    const accessToken = await jwt.sign({ id: value }, this.secret)
    return new Promise(resolve => resolve(accessToken))
  }
}