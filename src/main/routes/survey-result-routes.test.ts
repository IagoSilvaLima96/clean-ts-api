import env from '@/main/config/env'
import app from '@/main/config/app'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import request from 'supertest'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'

let surveyCollection: Collection
let accountCollection: Collection
let surveyResultCollection: Collection

const makeAccessToken = async (): Promise<string> => {
  const { insertedId: id } = await accountCollection.insertOne({
    name: 'Iago',
    email: 'iagocrouchlima@live.com',
    password: 'bnmk'
  })

  const accessToken = sign(id.toHexString(), env.jwtSecret)
  await accountCollection.updateOne({
    _id: id
  }, {
    $set: {
      accessToken
    }
  })
  return accessToken
}

const makeSurveyId = async (): Promise<string> => {
  const { insertedId: id } = await surveyCollection.insertOne({
    question: 'Question',
    answers: [{
      answer: 'any_answer',
      image: 'http://image-name.com'
    }, {
      answer: 'other_answer'
    }],
    date: new Date()
  })

  return id.toHexString()
}

describe('SurveyResult Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    accountCollection = await MongoHelper.getCollection('accounts')
    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyCollection.deleteMany({})
    await accountCollection.deleteMany({})
    await surveyResultCollection.deleteMany({})
  })

  describe('PUT /surveys/:surveyId/results', () => {
    test('Should return 403 on save survey result without accessToken', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .send({
          answer: 'any_answer'
        })
        .expect(403)
    })

    test('Should return 200 on save survey result with accessToken', async () => {
      const surveyId = await makeSurveyId()
      const accessToken = await makeAccessToken()
      await request(app)
        .put(`/api/surveys/${surveyId}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'any_answer'
        })
        .expect(200)
    })
  })
})
