export interface Hasher {
  hash (value: any): Promise<string>
  compare (value: string, hash: string): Promise<boolean>
}
