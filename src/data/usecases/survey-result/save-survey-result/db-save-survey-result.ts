import { SaveSurveyResult, SurveyResultModel, SaveSurveyResultParams, SaveSurveyResultRepository } from './db-save-survey-result-protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (private readonly saveSurveyResultRepository: SaveSurveyResultRepository) {}
  async save (saveSurveyResultParams: SaveSurveyResultParams): Promise<SurveyResultModel> {
    return await this.saveSurveyResultRepository.save(saveSurveyResultParams)
  }
}
