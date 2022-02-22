export class SignUpController {
  handle (httpRequest: any): any {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return new Error('Missing param: ' + field)
      }
    }
    return {
      statusCode: 200,
      body: {}
    }
  }
}
