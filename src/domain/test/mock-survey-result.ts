import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultParams, SaveSurveyResult } from '@/domain/usecases/survey-result/save-survey-result'

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => ({
  accountId: 'any_account_id',
  surveyId: 'any_survey_id',
  answer: 'any_answer',
  date: new Date()
})

export const mockSurveyResultModel = (): SurveyResultModel => ({
  surveyId: 'any_survey_id',
  question: 'any_question',
  answers: [{
    answer: 'any_answer',
    count: 1,
    percent: 50
  }, {
    answer: 'other_answer',
    count: 1,
    percent: 50
  }],
  date: new Date()
})

export const mockSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return mockSurveyResultModel()
    }
  }

  return new SaveSurveyResultStub()
}
