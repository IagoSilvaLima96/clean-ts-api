import { Controller, HttpRequest, HttpResponse, LoadSurveyById, SurveyAnswerModel } from './save-survey-result-controller-protocols'
import { ok, badRequest, serverError } from '@/presentation/helpers/http/http-helper'
import { InvalidParamError } from '@/presentation/errors'

export class SaveSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const { answer } = httpRequest.body
      const survey = await this.loadSurveyById.loadById(surveyId)

      if (!survey) {
        return badRequest(new InvalidParamError('surveyId'))
      }

      if (!this.answerExists(survey.answers, answer)) {
        return badRequest(new InvalidParamError('answer'))
      }

      return ok({})
    } catch (error) {
      return serverError(error)
    }
  }

  private answerExists (answers: SurveyAnswerModel[], answer: string): boolean {
    return answers.some(item => item.answer === answer)
  }
}
