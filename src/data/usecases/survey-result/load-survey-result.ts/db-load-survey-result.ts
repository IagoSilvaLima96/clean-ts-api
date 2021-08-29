import {
  LoadSurveyResult,
  SurveyResultModel,
  LoadSurveyResultRepository,
  LoadSurveyByIdRepository,
  SurveyModel
} from './db-load-survey-result-protocols'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    private readonly loadSurveyIdRepository: LoadSurveyByIdRepository
  ) {}

  async load (surveyId: string): Promise<SurveyResultModel> {
    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(surveyId)
    if (!surveyResult) {
      const { question, date, answers } = (await this.loadSurveyIdRepository.loadById(surveyId)) as SurveyModel
      return {
        surveyId,
        question,
        date,
        answers: answers.map(item => ({
          count: 0,
          percent: 0,
          answer: item.answer,
          image: item.image
        }))
      }
    }
    return surveyResult
  }
}
