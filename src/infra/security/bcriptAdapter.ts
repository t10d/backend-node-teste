import { Encrypter } from "../../data/interfaces/encripter"
import bcrypt from "bcrypt"

export class BcriptAdapter implements Encrypter {
  constructor (private readonly saltRounds = 10) {}

  async encrypt (value: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const hashedValue = bcrypt.hash(value, this.saltRounds)
      return resolve(hashedValue)
    })
  }
}
