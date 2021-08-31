import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository'
import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'
import { MongoHelper, QueryBuilder } from '../helpers'
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository'
import { SurveyModel } from '@/domain/models/survey'
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'
import { ObjectId } from 'mongodb'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository {
  async add (addSurveyData: AddSurveyParams): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(addSurveyData)
  }

  async loadAll (accountId: string): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')

    const query = new QueryBuilder()
      .lookup({
        from: 'surveyResults',
        foreignField: 'surveyId',
        localField: '_id',
        as: 'result'
      })
      .project({
        _id: 1,
        question: 1,
        answers: 1,
        didAnswer: {
          $gte: [{
            $size: {
              $filter: {
                input: '$result',
                as: 'item',
                cond: {
                  $eq: ['$$item.accountId', new ObjectId(accountId)]
                }
              }
            }
          }, 1]
        }
      }).build()
    const surveys = await surveyCollection.aggregate(query).toArray()
    return MongoHelper.mapList(surveys)
  }

  async loadById (id: string): Promise<SurveyModel | null> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const surveyDocument = await surveyCollection.findOne({ _id: new ObjectId(id) })
    if (surveyDocument) {
      return MongoHelper.map<SurveyModel>(surveyDocument)
    }
    return null
  }
}
