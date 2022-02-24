import { Encrypter } from "../../data/interfaces/encripter"
import bcrypt from "bcrypt"

export class BcriptAdapter implements Encrypter {
  constructor (private readonly saltRounds = 10) {}

  async encrypt (value: any): Promise<string> {
    const hashedValue = await bcrypt.hash(value, this.saltRounds)
    return hashedValue
  }
}
