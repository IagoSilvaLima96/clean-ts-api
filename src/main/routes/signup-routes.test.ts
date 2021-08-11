import request from 'supertest'
import app from '../config/app'

describe('SignUp Routes', () => {
  test('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Iago',
        email: 'iagocrouchlima@gmail.com',
        password: 'iagos',
        passwordConfirmation: 'iagos'
      })
      .expect(200)
  })
})
