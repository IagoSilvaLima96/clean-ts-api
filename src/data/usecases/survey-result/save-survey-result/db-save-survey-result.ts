import {
  SaveSurveyResult,
  SurveyResultModel,
  SaveSurveyResultParams,
  SaveSurveyResultRepository,
  LoadSurveyResultRepository
} from './db-save-survey-result-protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository
  ) {}

  async save (saveSurveyResultParams: SaveSurveyResultParams): Promise<SurveyResultModel> {
    await this.saveSurveyResultRepository.save(saveSurveyResultParams)
    const { surveyId, accountId } = saveSurveyResultParams
    return (await this.loadSurveyResultRepository.loadBySurveyId(surveyId, accountId)) as SurveyResultModel
  }
}
