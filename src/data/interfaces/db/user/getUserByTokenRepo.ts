import { UserModel } from "../../../../domain/models";

export interface GetUserByTokenRepo {
  getByToken (token: string, role?: string): Promise<UserModel> 
}