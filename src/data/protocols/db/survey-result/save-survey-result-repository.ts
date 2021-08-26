import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'
import { SurveyResultModel } from '@/domain/models/survey-result'

export interface SaveSurveyResultRepository {
  save: (saveSurveyResultData: SaveSurveyResultParams) => Promise<SurveyResultModel>
}
