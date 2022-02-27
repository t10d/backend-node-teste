import { UserModel } from "../../../domain/models";

export interface LoadUserByEmailRepo {
  load (email: string): Promise<UserModel> 
}