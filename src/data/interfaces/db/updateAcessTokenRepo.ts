export interface UpdateAccessTokenRepo {
  updateAccessToken (id: string, token: string): Promise<void>
}