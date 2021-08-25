import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveyById,
  SurveyAnswerModel,
  SaveSurveyResult,
  SaveSurveyResultModel
} from './save-survey-result-controller-protocols'
import { ok, badRequest, serverError } from '@/presentation/helpers/http/http-helper'
import { InvalidParamError } from '@/presentation/errors'

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
      const saveSurveyResultModel: SaveSurveyResultModel = {
        surveyId,
        accountId: accountId as string,
        answer,
        date: new Date()
      }
      await this.saveSurveyResult.save(saveSurveyResultModel)
      return ok({})
    } catch (error) {
      return serverError(error)
    }
  }

  private answerExists (answers: SurveyAnswerModel[], answer: string): boolean {
    return answers.some(item => item.answer === answer)
  }
}
