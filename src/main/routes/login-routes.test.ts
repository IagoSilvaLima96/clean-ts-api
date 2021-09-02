import request from 'supertest'
import app from '@/main/config/app'
import { MongoHelper } from '@/infra/db'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'

describe('Login Routes', () => {
  let accountCollection: Collection
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /signup', () => {
    test('Should return 200 on signup', async () => {
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

  describe('POST /login', () => {
    test('Should return 200 on login', async () => {
      const password = await hash('iagos', 12)
      await accountCollection.insertOne({
        name: 'Iago',
        email: 'iagocrouchlima@gmail.com',
        password
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'iagocrouchlima@gmail.com',
          password: 'iagos'
        })
        .expect(200)
    })

    test('Should return 401 on login', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'iagocrouchlima@gmail.com',
          password: 'iagos'
        })
        .expect(401)
    })
  })
})
