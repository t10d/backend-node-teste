import express from 'express'
import { preMiddlewares, postMiddlewares } from './middlewares'
import setupRoutes from './routes'

const app = express()

preMiddlewares(app)
setupRoutes(app)
postMiddlewares(app)

export default app