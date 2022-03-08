import { Hasher } from "../../data/interfaces/security/hasher"
import bcrypt from "bcrypt"
import { HashComparer } from "../../data/interfaces/security/hashComparer"

export class BcriptAdapter implements Hasher, HashComparer {
  constructor (private readonly saltRounds: number) {}

  async hash (value: any): Promise<string> {
    const hashedValue = await bcrypt.hash(value, this.saltRounds)
    return hashedValue
  }

  async compare(value: string, hash: string): Promise<boolean> {
    const isValid = await bcrypt.compare(value, hash)
    return new Promise(resolve => resolve(isValid))
  }
}
