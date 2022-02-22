import { MissingParamError } from "../errors/missing-param-error"

export class SignUpController {
  handle (httpRequest: any): any {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return new MissingParamError(field)
      }
    }
    return {
      statusCode: 200,
      body: {}
    }
  }
}
