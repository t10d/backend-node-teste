import { AddUserModel, AddUserRepo, UserModel } from "../../data/useCases/addUser/interfaces"
import { FirestoreHelper } from "../helpers/firestoreHelper"

export class FirestoreAuthRepo implements AddUserRepo {
  async add (userData: AddUserModel): Promise<UserModel> {
    return FirestoreHelper.getAuth()
      .createUser(userData)
      .then((userRecord: any) => {
        return {
          id: userRecord.id,
          name: userRecord.name,
          email: userRecord.email,
          password: userRecord.password
        }
      })
      .catch((err: any) => {
        throw new Error(err)
      })
  }
}