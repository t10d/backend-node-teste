import { Express } from 'express'
import { bodyParser, contentType, cors } from '../middlewares'
import { error } from '../middlewares/error'

export default (app: Express): void => {
  app.use(bodyParser)
  app.use(cors)
  app.use(contentType)
  app.use(error)
}