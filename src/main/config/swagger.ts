import swaggerConfig from '../docs'
import { serve, setup } from 'swagger-ui-express'
import { Express } from 'express'
import { noCache } from '../middlewares/noCache'

export const setupSwagger = (app: Express): void => {
  app.use('/docs', noCache, serve, setup(swaggerConfig))
}