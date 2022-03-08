export class MissingParamError extends Error {
  constructor (paramName: string) {
    super(`Missing param: ${paramName}`)
    this.name = 'MissingParamError'
  }
}

export class InvalidParamError extends Error {
  constructor (paramName: string) {
    super(`Invalid param: ${paramName}`)
    this.name = 'InvalidParamError'
  }
}

export class EmailInUseError extends Error {
  constructor () {
    super('Email already in use')
    this.name = 'EmailInUseError'
  }
}

export class UserNotFoundError extends Error {
  constructor () {
    super('User to invited not found')
    this.name = 'UserNotFoundError'
  }
}