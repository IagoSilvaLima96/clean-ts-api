import { MongoHelper, SurveyResultMongoRepository } from '@/infra/db'
import { mockAddAccountParams, mockAddSurveyParams } from '@/tests/domain/mocks'
import { Collection, ObjectId } from 'mongodb'

let surveyCollection: Collection
let accountCollection: Collection
let surveyResultCollection: Collection

const mockAccountId = async (): Promise<string> => {
  const { insertedId: id } = await accountCollection.insertOne(mockAddAccountParams())
  return id.toHexString()
}

const mockSurveyId = async (): Promise<string> => {
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
      const accountId = await mockAccountId()
      const surveyId = await mockSurveyId()
      const answer = 'other_answer'
      await sut.save({
        surveyId,
        accountId,
        answer,
        date: new Date()
      })
      const surveyResult = await surveyResultCollection.findOne({
        surveyId: new ObjectId(surveyId),
        accountId: new ObjectId(accountId)
      })
      expect(surveyResult).toBeTruthy()
    })

    test('Should update a survey result if its not new', async () => {
      const sut = makeSut()
      const accountId = await mockAccountId()
      const surveyId = await mockSurveyId()
      const answer = 'other_answer'
      await surveyResultCollection.insertOne({
        surveyId: new ObjectId(surveyId),
        accountId: new ObjectId(accountId),
        answer,
        date: new Date()
      })
      await sut.save({
        surveyId,
        accountId,
        answer: 'any_answer',
        date: new Date()
      })
      const surveyResult = await surveyResultCollection.find({
        surveyId: new ObjectId(surveyId),
        accountId: new ObjectId(accountId)
      }).toArray()
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.length).toBe(1)
    })
  })

  describe('loadSurveyById', () => {
    test('Should load survey result correctly', async () => {
      const addSurveyParams = mockAddSurveyParams()
      const sut = makeSut()
      const accountId = await mockAccountId()
      const otherAccountId = await mockAccountId()
      const surveyId = await mockSurveyId()
      await surveyResultCollection.insertMany([{
        surveyId: new ObjectId(surveyId),
        accountId: new ObjectId(accountId),
        answer: addSurveyParams.answers[0].answer,
        date: new Date()
      },
      {
        surveyId: new ObjectId(surveyId),
        accountId: new ObjectId(otherAccountId),
        answer: addSurveyParams.answers[1].answer,
        date: new Date()
      },
      {
        surveyId: new ObjectId(surveyId),
        accountId: new ObjectId(accountId),
        answer: addSurveyParams.answers[1].answer,
        date: new Date()
      }, {
        surveyId: new ObjectId(surveyId),
        accountId: new ObjectId(otherAccountId),
        answer: addSurveyParams.answers[2].answer,
        date: new Date()
      }])
      const surveyResult = await sut.loadBySurveyId(surveyId, accountId)
      expect(surveyResult).toBeTruthy()
      expect(surveyResult?.surveyId).toEqual(surveyId)
      expect(surveyResult?.answers[0].answer).toBe(addSurveyParams.answers[1].answer)
      expect(surveyResult?.answers[0].count).toBe(2)
      expect(surveyResult?.answers[0].percent).toBe(50)
      expect(surveyResult?.answers[0].isCurrentAccountAnswer).toBe(false)
      expect(surveyResult?.answers[1].count).toBe(1)
      expect(surveyResult?.answers[1].percent).toBe(25)
      expect(surveyResult?.answers[1].isCurrentAccountAnswer).toBe(true)
      expect(surveyResult?.answers[2].count).toBe(1)
      expect(surveyResult?.answers[2].percent).toBe(25)
      expect(surveyResult?.answers[2].isCurrentAccountAnswer).toBe(false)
      expect(surveyResult?.answers[3].count).toBe(0)
      expect(surveyResult?.answers[3].percent).toBe(0)
      expect(surveyResult?.answers[3].isCurrentAccountAnswer).toBe(false)
    })

    test('Should return null if there is no survey result', async () => {
      const sut = makeSut()
      const surveyId = await mockSurveyId()
      const accountId = await mockAccountId()
      const surveyResult = await sut.loadBySurveyId(surveyId, accountId)
      expect(surveyResult).toBeFalsy()
    })
  })
})
