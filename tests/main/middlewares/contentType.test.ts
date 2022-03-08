import request from 'supertest'
import app from '../../../src/main/config/app'

describe('Content Type Middleware', () => {
  test('Should return content type as JSON', async () => {
    app.get('/test_content_type', (req, res) => {
      res.send('')
    })
    await request(app)
      .get('/test_content_type')
      .expect('content-type', /json/)
  })
})
