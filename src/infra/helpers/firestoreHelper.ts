import * as admin from 'firebase-admin'

const firebaseKey = require('../../../keys/auth-api-342301-firebase-adminsdk-y8u6y-857a7a96b2.json')

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

  getAuth (): any {
    return admin.auth()
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
  },

  async deleteCollection (collectionPath: string, batchSize: number) {
    const collectionRef = this.db.collection(collectionPath)
    const query = collectionRef.orderBy('__name__').limit(batchSize)
  
    return new Promise((resolve, reject) => {
      this.deleteQueryBatch(query, resolve).catch(reject)
    })
  },
  
  async deleteQueryBatch(query: any, resolve: any) {
    const snapshot = await query.get();
  
    const batchSize = snapshot.size;
    if (batchSize === 0) {
      // When there are no documents left, we are done
      resolve()
      return
    }
  
    // Delete documents in a batch
    const batch = this.db.batch();
    snapshot.docs.forEach((doc: any) => {
      batch.delete(doc.ref);
    })
    await batch.commit()
  
    // Recurse on the next process tick, to avoid
    // exploding the stack.
    process.nextTick(() => {
      this.deleteQueryBatch(query, resolve)
    })
  }
}
