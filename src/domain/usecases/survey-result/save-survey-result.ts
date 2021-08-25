import { SurveyResultModel } from '../../models/survey-result'

export type SaveSurveyResultModel = Omit<SurveyResultModel, 'id'>

export interface SaveSurveyResult {
  save: (saveSurveyResultModel: SaveSurveyResultModel) => Promise<SurveyResultModel>
}
