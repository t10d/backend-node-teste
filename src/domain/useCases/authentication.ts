export interface AuthModel {
  email: string
  password: string
}

export interface Authentication {
  auth (auth: AuthModel): Promise<string>
}
