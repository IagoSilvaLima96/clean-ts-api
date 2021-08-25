import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository'
import { SaveSurveyResultModel } from '@/domain/usecases/survey-result/save-survey-result'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    const query = {
      surveyId: data.surveyId,
      accountId: data.accountId
    }
    await surveyResultCollection.findOneAndUpdate(query, {
      $set: {
        answer: data.answer,
        date: data.date
      }
    }, {
      upsert: true
    })
    const surveyResultDocument = await surveyResultCollection.findOne(query)
    return MongoHelper.map<SurveyResultModel>(surveyResultDocument)
  }
}
