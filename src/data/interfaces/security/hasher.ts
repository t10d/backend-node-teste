export interface Hasher {
  hash (value: any): Promise<string>
}
