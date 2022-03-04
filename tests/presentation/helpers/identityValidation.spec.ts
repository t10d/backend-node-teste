import { IdentityValidationRepo } from "../../../src/data/interfaces/db/validation/IdentityValidationRepo"
import { UnauthorizedError } from "../../../src/presentation/errors/unathorizedError"
import { IdentityValidation } from "../../../src/presentation/helpers/validators/identityValidation"

type SutTypes = {
  sut: IdentityValidation
  identityValidationRepo: IdentityValidationRepoSpy
}

class IdentityValidationRepoSpy implements IdentityValidationRepo {
  validateIdentity (): Promise<boolean> {
    return new Promise((resolve) => resolve(false))
  }
}

const makeSut = (): SutTypes => {
  const identityValidationRepo = new IdentityValidationRepoSpy()
  const sut = new IdentityValidation("any_field_name", "any_collection_field", "any_collection_name", "any_field_id", identityValidationRepo)
  return {
    sut,
    identityValidationRepo
  }
}

describe('Identity Validation', () => {
  test('Should return an error if validate returns false', () => {
    const { sut, identityValidationRepo } = makeSut()
    jest.spyOn(identityValidationRepo, 'validateIdentity').mockReturnValueOnce(new Promise(resolve => resolve(false)))
    const error = sut.validate({ any_field_name: 'any_field_value' })
    expect(error).toEqual(new UnauthorizedError())
  })

  test('Should call validate with correct value', () => {
    const { sut, identityValidationRepo } = makeSut()
    const validateSpy = jest.spyOn(identityValidationRepo, 'validateIdentity')
    sut.validate({ any_field_name: "any_value" })
    expect(validateSpy).toHaveBeenCalledWith("any_value", "any_collection_field", "any_collection_name", "any_field_id")
  })

  test('Should throw if validateIdentity throws', () => {
    const { sut, identityValidationRepo } = makeSut()
    console.log(sut)
    jest.spyOn(identityValidationRepo, 'validateIdentity').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()))
    })
    expect(sut.validate).toThrow()
  })
})