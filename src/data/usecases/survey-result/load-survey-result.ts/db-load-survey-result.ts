import {
  LoadSurveyResult,
  SurveyResultModel,
  LoadSurveyResultRepository,
  LoadSurveyByIdRepository
} from './db-load-survey-result-protocols'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    private readonly loadSurveyIdRepository: LoadSurveyByIdRepository
  ) {}

  async load (surveyId: string): Promise<SurveyResultModel> {
    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(surveyId)
    if (!surveyResult) {
      await this.loadSurveyIdRepository.loadById(surveyId)
    }
    return surveyResult as SurveyResultModel
  }
}
