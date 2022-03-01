import { UserModel } from "../models";

export interface GetUserByToken {
  getByToken (accessToken: string, role?: string): Promise<UserModel>
}
