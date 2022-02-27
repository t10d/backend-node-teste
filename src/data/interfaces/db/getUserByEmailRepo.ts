import { UserModel } from "../../../domain/models";

export interface GetUserByEmailRepo {
  loadByEmail (email: string): Promise<UserModel> 
}