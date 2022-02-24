import request from 'supertest'
import app from '../../../src/main/config/app'

describe('CORS Middleware', () => {
  test('Should cors have been enable', async () => {
    app.post('/test_cors', (req, res) => {
      res.send()
    })
    await request(app)
      .post('/test_cors')
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-methods', '*')
      .expect('access-control-allow-headers', '*')
  })
}) 