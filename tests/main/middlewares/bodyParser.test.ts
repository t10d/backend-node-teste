import request from 'supertest'
import app from '../../../src/main/config/app'
import * as notFound from '../../../src/main/middlewares/notFound'

jest.mock('../../../src/main/middlewares/notFound')

describe('Body Parser Middleware', () => {
  test('Should parser json from body', async () => {
    jest.spyOn(notFound, 'notFound').mockImplementationOnce((req, res, next) => next())
    app.post('/test_body_parser', (req, res) => {
      res.send(req.body)
    })
    await request(app)
      .post('/test_body_parser')
      .send({ name: 'Chupeta' })
      .expect({ name: 'Chupeta' })
  })
})