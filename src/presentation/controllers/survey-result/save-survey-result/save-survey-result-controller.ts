import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { ok, badRequest, serverError } from '@/presentation/helpers'
import { InvalidParamError } from '@/presentation/errors'
import { SurveyAnswerModel } from '@/domain/models'
import { LoadSurveyById, SaveSurveyResult, SaveSurveyResultParams } from '@/domain/usecases'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { accountId } = httpRequest
      const { surveyId } = httpRequest.params
      const { answer } = httpRequest.body
      const survey = await this.loadSurveyById.loadById(surveyId)

      if (!survey) {
        return badRequest(new InvalidParamError('surveyId'))
      }

      if (!this.answerExists(survey.answers, answer)) {
        return badRequest(new InvalidParamError('answer'))
      }
      const saveSurveyResultParams: SaveSurveyResultParams = {
        surveyId,
        accountId: accountId as string,
        answer,
        date: new Date()
      }
      const surveyResult = await this.saveSurveyResult.save(saveSurveyResultParams)
      return ok(surveyResult)
    } catch (error) {
      return serverError(error)
    }
  }

  private answerExists (answers: SurveyAnswerModel[], answer: string): boolean {
    return answers.some(item => item.answer === answer)
  }
}
