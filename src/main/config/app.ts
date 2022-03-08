import express from 'express'
import { preMiddlewares, postMiddlewares } from './middlewares'
import setupRoutes from './routes'
import { setupSwagger } from './swagger'

const app = express()

setupSwagger(app)
preMiddlewares(app)
setupRoutes(app)
postMiddlewares(app)

export default app