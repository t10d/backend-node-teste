import swaggerConfig from '../docs'
import { serve, setup } from 'swagger-ui-express'
import { Express } from 'express'

export const setupSwagger = (app: Express): void => {
  app.use('/docs', serve, setup(swaggerConfig))
}