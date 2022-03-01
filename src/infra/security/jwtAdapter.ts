import jwt from 'jsonwebtoken'
import { Decrypter } from '../../data/interfaces/security/decrypter';
import { Encrypter } from "../../data/interfaces/security/Encrypter";

export class JWTAdapter implements Encrypter, Decrypter {
  constructor (private readonly secret: string) {}

  async encrypt(value: string): Promise<string> {
    const accessToken = await jwt.sign({ id: value }, this.secret)
    return new Promise(resolve => resolve(accessToken))
  }

  async decrypt(token: string): Promise<string> {
    const value: any = await jwt.verify(token, this.secret)
    return value
  } 
}