export interface UpdateAccessTokenRepo {
  update (id: string, token: string): Promise<void>
}