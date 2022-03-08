import { IdentityValidationRepo } from "../../../../src/data/interfaces/db/validation/IdentityValidationRepo"
import { ValidationRepo } from "../../../../src/infra/db/firestore/validationRepo"
import { FirestoreHelper } from "../../../../src/infra/helpers/firestoreHelper"

interface SUTTypes {
  sut: IdentityValidationRepo
}

const makeSUT = (): SUTTypes => {
  const sut = new ValidationRepo()
  return {
    sut
  }
}

describe('Budget Repository', () => {
  beforeAll(() => {
    FirestoreHelper.connect()
  })
 
  afterAll(async () => {
    await FirestoreHelper.deleteCollection('test', 100)
  })

  describe('validateIdentity', () => {
    test('Should return a true if found values', async () => {
      const { sut } = makeSUT()
      
      await FirestoreHelper.getCollection('test').doc('test_id').set({
         id: 'any_id',
         field_to_test: 'field_value' 
      })
      const budget = await sut.validateIdentity('field_value', 'field_to_test', 'test', 'test_id')

      expect(budget).toBeTruthy()
    })

    test('Should return false if not found values', async () => {
      const { sut } = makeSUT()

      const budget = await sut.validateIdentity('field_value_not_found', 'field_to_test_not_found', 'test_not_found', 'test_id_not_found')

      expect(budget).toBeFalsy()
    })
  })
})