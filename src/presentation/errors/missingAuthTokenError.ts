export class MissingAuthTokenError extends Error {
  constructor () {
    super('Access denied. Missing auth token')
    this.name = 'MissingAuthTokenError'
  }
}