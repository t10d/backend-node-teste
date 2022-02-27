import { FirestoreHelper } from "../infra/db/firestore/helpers/firestoreHelper";
import env from "./config/env";

FirestoreHelper.connect()
  .then(async () => {
    const app = (await import("./config/app")).default
    app.listen(env.port, () => console.log('Server running at http://localhost:6060'))
  })
  .catch(console.error)
