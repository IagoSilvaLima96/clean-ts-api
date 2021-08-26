import { SurveyResultModel } from '../../models/survey-result'

export type SaveSurveyResultParams = Omit<SurveyResultModel, 'id'>

export interface SaveSurveyResult {
  save: (SaveSurveyResultParams: SaveSurveyResultParams) => Promise<SurveyResultModel>
}
