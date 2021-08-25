import { SaveSurveyResult, SurveyResultModel, SaveSurveyResultModel, SaveSurveyResultRepository } from './db-save-survey-result-protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (private readonly saveSurveyResultRepository: SaveSurveyResultRepository) {}
  async save (saveSurveyResultModel: SaveSurveyResultModel): Promise<SurveyResultModel | null> {
    await this.saveSurveyResultRepository.save(saveSurveyResultModel)
    return null
  }
}
