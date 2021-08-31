import { SurveyMongoRepository } from './survey-mongo-repository'
import { mockAddSurveyParams, mockAddSurveysParams, mockAddAccountParams } from '@/domain/test'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { Collection, ObjectId } from 'mongodb'

let accountCollection: Collection
let surveyResultCollection: Collection

const mockAccountId = async (): Promise<string> => {
  const { insertedId: id } = await accountCollection.insertOne(mockAddAccountParams())
  return id.toHexString()
}

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

describe('Survey Mongo Repository', () => {
  let surveyCollection: Collection
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

  describe('add()', () => {
    test('Should add a survey on success', async () => {
      const sut = makeSut()
      const addSurveyParams = mockAddSurveyParams()
      await sut.add(addSurveyParams)
      const survey = await surveyCollection.findOne({ question: addSurveyParams.question })
      expect(survey).toBeTruthy()
    })
  })

  describe('loadAll()', () => {
    test('Should return surveys on success', async () => {
      const accountId = await mockAccountId()
      const sut = makeSut()
      const addSurveysParams = mockAddSurveysParams()
      const { insertedIds: ids } = await surveyCollection.insertMany(addSurveysParams)
      const answer = addSurveysParams[0].answers[0].answer
      const surveyId = ids[0]
      await surveyResultCollection.insertOne({
        surveyId,
        answer,
        accountId: new ObjectId(accountId),
        date: new Date()
      })
      const surveys = await sut.loadAll(accountId)
      console.log(surveys)
      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toBe(addSurveysParams[0].question)
      expect(surveys[0].didAnswer).toBe(true)
      expect(surveys[1].id).toBeTruthy()
      expect(surveys[1].question).toBe(addSurveysParams[1].question)
      expect(surveys[1].didAnswer).toBe(false)
    })

    test('Should return empty list', async () => {
      const accountId = await mockAccountId()
      const sut = makeSut()
      const surveys = await sut.loadAll(accountId)
      expect(surveys.length).toBe(0)
    })
  })

  describe('loadById()', () => {
    test('Should return a survey on success', async () => {
      const sut = makeSut()
      const addSurveyParams = mockAddSurveyParams()
      const { insertedId: id } = await surveyCollection.insertOne(addSurveyParams)
      const survey = await sut.loadById(id.toHexString())
      expect(survey).toBeTruthy()
      expect(survey?.id).toBe(id.toHexString())
      expect(survey?.question).toBe(addSurveyParams.question)
    })

    test('Should return null if survey not exists', async () => {
      const sut = makeSut()
      const survey = await sut.loadById('5b201f046acf8abf84767153')
      expect(survey).toBeNull()
    })
  })
})
