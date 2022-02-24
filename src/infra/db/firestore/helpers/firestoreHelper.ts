import * as admin from 'firebase-admin'

const firebaseKey = require('../../../../../keys/auth-api-342301-firebase-adminsdk-y8u6y-857a7a96b2.json')

admin.initializeApp({
  credential: admin.credential.cert(firebaseKey)
})

const db = admin.firestore()
export { admin, db }
