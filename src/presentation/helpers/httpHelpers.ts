import { ServerError } from "../errors/serverError"
import { UnauthorizedError } from "../errors/unathorizedError"
import { HttpResponse } from "../interfaces/http"

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: { error: error.message } 
})

export const forbidden = (error: Error): HttpResponse => ({
  statusCode: 403,
  body: error 
})

export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: { error: new UnauthorizedError().message }
})

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack)
})

export const ok = (data?: any): any => {
  return data ? { statusCode: 200, body: data } : { statusCode: 200 }
}

