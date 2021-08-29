import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'

export interface SaveSurveyResultRepository {
  save: (saveSurveyResultData: SaveSurveyResultParams) => Promise<void>
}
