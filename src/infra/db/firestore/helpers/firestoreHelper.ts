import * as admin from 'firebase-admin'
const firebaseKey = require('../../../../../keys/auth-api-342301-firebase-adminsdk-y8u6y-857a7a96b2.json')

admin.initializeApp({
  credential: admin.credential.cert(firebaseKey)
})

const db = admin.firestore()

export const FirestoreHelper = {
  getCollection (name: string): FirebaseFirestore.CollectionReference {
    return db.collection(name)
  },

  async deleteAll (name: string): Promise<any> {
    const docs = await this.getCollection(name).listDocuments()
    docs.forEach(doc => {
      doc.delete()
    })
  }
}
