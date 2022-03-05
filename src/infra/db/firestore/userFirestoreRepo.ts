import { AddUserRepo } from "../../../data/interfaces/db/user/addUserRepo"
import { GetUserByEmailRepo } from "../../../data/interfaces/db/user/getUserByEmailRepo"
import { UpdateAccessTokenRepo } from "../../../data/interfaces/db/user/updateAcessTokenRepo"
import { UserModel } from "../../../domain/models"
import { AddUserModel } from "../../../domain/useCases"
import { GetUserByToken } from "../../../domain/useCases/getUserByToken"
import { FirestoreHelper } from "../../helpers/firestoreHelper"

export class UserFirestoreRepo implements AddUserRepo, GetUserByEmailRepo, UpdateAccessTokenRepo, GetUserByToken {
  async add (userData: AddUserModel): Promise<UserModel> {
    const user = FirestoreHelper.getCollection('users').doc()
    const userObject = { id: user.id, ...userData }

    await user.set(userObject)
    
    return new Promise(resolve => resolve(userObject))
  }

  async getByEmail(email: string): Promise<UserModel> {
    const usersCol = FirestoreHelper.getCollection('users')
    const usersSnapshot = await usersCol.where('email', '==', email).get()
    if (!usersSnapshot.empty) {
      const userDoc = usersSnapshot.docs[0].data()
      return {
        id: userDoc.id,
        name: userDoc.name,
        email: userDoc.email,
        password: userDoc.password
      }
    }
    return null
  }

  async getByToken(token: string, role?: string): Promise<UserModel> {
    let usersQuery: FirebaseFirestore.Query<FirebaseFirestore.DocumentData>
    usersQuery = FirestoreHelper.getCollection('users').where('accessToken', '==', token)
    if (role) {
      usersQuery = usersQuery.where('role', '==', role)
    }
    const usersSnapshot = await usersQuery.get()
    if (!usersSnapshot.empty) {
      const userDoc = usersSnapshot.docs[0].data()
      return {
        id: userDoc.id,
        name: userDoc.name,
        email: userDoc.email,
        password: userDoc.password
      }
    }
    return null
  }

  async updateAccessToken(id: string, token: string): Promise<void> {
    const userDoc = FirestoreHelper.getCollection('users').doc(id)
    await userDoc.update({ accessToken: token })
  } 
}
