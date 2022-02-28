import * as admin from 'firebase-admin'

const firebaseKey = require('../../../../../keys/auth-api-342301-firebase-adminsdk-y8u6y-857a7a96b2.json')

export const FirestoreHelper = {
  db: null as admin.firestore.Firestore,

  async connect (): Promise<void> {
    if (!this.db) {
      admin.initializeApp({
        credential: admin.credential.cert(firebaseKey)
      })
    }
    
    this.db = admin.firestore()
  },

  getCollection (name: string): FirebaseFirestore.CollectionReference {
    if (!this.db) {
      this.connect()
    }
    return this.db.collection(name)
  },

  async deleteAll (name: string): Promise<void> {
    const docs = await this.getCollection(name).listDocuments()
    docs.forEach((doc: FirebaseFirestore.DocumentReference) => {
      doc.delete()
    })
  }
}
