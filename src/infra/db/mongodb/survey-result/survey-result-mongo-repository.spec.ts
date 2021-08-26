import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { mockAddAccountParams, mockAddSurveyParams } from '@/domain/test'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'

let surveyCollection: Collection
let accountCollection: Collection
let surveyResultCollection: Collection

const makeAccountId = async (): Promise<string> => {
  const { insertedId: id } = await accountCollection.insertOne(mockAddAccountParams())
  return id.toHexString()
}

const makeSurveyId = async (): Promise<string> => {
  const { insertedId: id } = await surveyCollection.insertOne(mockAddSurveyParams())
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
    test('Should insert a survey result if its new', async () => {
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
      expect(surveyResult.id).toBeTruthy()
      expect(surveyResult.answer).toBe(answer)
    })

    test('Should update a survey result if its not new', async () => {
      const sut = makeSut()
      const accountId = await makeAccountId()
      const surveyId = await makeSurveyId()
      const answer = 'other_answer'
      const { insertedId: id } = await surveyResultCollection.insertOne({
        surveyId,
        accountId,
        answer,
        date: new Date()
      })
      const surveyResult = await sut.save({
        surveyId,
        accountId,
        answer: 'any_answer',
        date: new Date()
      })
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toBe(id.toHexString())
      expect(surveyResult.answer).toBe('any_answer')
    })
  })
})
