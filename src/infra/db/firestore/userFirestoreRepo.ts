import { AddUserRepo } from "../../../data/interfaces/db/addUserRepo"
import { GetUserByEmailRepo } from "../../../data/interfaces/db/getUserByEmailRepo"
import { UpdateAccessTokenRepo } from "../../../data/interfaces/db/updateAcessTokenRepo"
import { UserModel } from "../../../domain/models"
import { AddUserModel } from "../../../domain/useCases"
import { FirestoreHelper } from "../firestore/helpers/firestoreHelper"

export class UserFirestoreRepo implements AddUserRepo, GetUserByEmailRepo, UpdateAccessTokenRepo {
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
      return FirestoreHelper.map(userDoc)
    }
    return null
  }

  async updateAccessToken(id: string, token: string): Promise<void> {
    const userDoc = FirestoreHelper.getCollection('users').doc(id)
    await userDoc.update({ accessToken: token })
  } 
}
