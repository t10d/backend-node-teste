import { Hasher } from "../../data/interfaces/security/hasher"
import bcrypt from "bcrypt"

export class BcriptAdapter implements Hasher {
  constructor (private readonly saltRounds: number) {}

  async hash (value: any): Promise<string> {
    const hashedValue = await bcrypt.hash(value, this.saltRounds)
    return hashedValue
  }
}
