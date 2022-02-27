import { ServerError } from "../errors/serverError"
import { UnauthorizedError } from "../errors/unathorizedError"
import { HttpResponse } from "../interfaces/http"

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: { error: error.message } 
})

export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: { error: new UnauthorizedError().message }
})

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack)
})

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})
