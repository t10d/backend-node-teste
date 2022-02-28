import { Express } from 'express'
import { bodyParser, contentType, cors } from '../middlewares'
import { error } from '../middlewares/error'
import { notFound } from '../middlewares/notFound'

export const preMiddlewares = (app: Express): void => {
  app.use(bodyParser)
  app.use(cors)
  app.use(contentType)
}

export const postMiddlewares = (app: Express): void => {
  app.use(error)
  app.use(notFound)
}