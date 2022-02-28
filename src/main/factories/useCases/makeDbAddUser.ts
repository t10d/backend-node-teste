import { DbAddUser } from "../../../data/useCases/addUser/dbAddUser";
import { UserFirestoreRepo } from "../../../infra/db/firestore/userFirestoreRepo";
import { BcriptAdapter } from "../../../infra/security/bcriptAdapter";

export const makeDbAddUser = (): DbAddUser => {
  const salt = 12
  const hasher = new BcriptAdapter(salt)
  const userFirestoreRepo = new UserFirestoreRepo()
  return new DbAddUser(hasher, userFirestoreRepo)
}