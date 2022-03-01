import { UserModel } from "../../../../domain/models";

export interface GetUserByEmailRepo {
  getByEmail (email: string): Promise<UserModel> 
}