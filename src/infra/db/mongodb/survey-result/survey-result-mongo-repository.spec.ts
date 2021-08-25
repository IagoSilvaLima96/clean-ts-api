import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'

let surveyCollection: Collection
let accountCollection: Collection
let surveyResultCollection: Collection

const makeAccountId = async (): Promise<string> => {
  const { insertedId: id } = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  })
  return id.toHexString()
}

const makeSurveyId = async (): Promise<string> => {
  const { insertedId: id } = await surveyCollection.insertOne({
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }, {
      image: 'other_image',
      answer: 'other_answer'
    }],
    date: new Date()
  })
  return id.toHexString()
}

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

describe('SurveyResult Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})
  })

  describe('save()', () => {
    test('Should save a survey result if its new', async () => {
      const sut = makeSut()
      const accountId = await makeAccountId()
      const surveyId = await makeSurveyId()
      const answer = 'other_answer'
      const surveyResult = await sut.save({
        surveyId,
        accountId,
        answer,
        date: new Date()
      })
      expect(surveyResult).toBeTruthy()
      expect(surveyResult?.id).toBeTruthy()
      expect(surveyResult?.answer).toBe(answer)
    })
  })
})
