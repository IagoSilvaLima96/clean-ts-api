import { Controller, HttpRequest, HttpResponse, LoadSurveyById } from './save-survey-result-controller-protocols'
import { ok, badRequest } from '@/presentation/helpers/http/http-helper'
import { InvalidParamError } from '@/presentation/errors'

export class SaveSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { params: { surveyId } } = httpRequest
    const survey = await this.loadSurveyById.loadById(surveyId)
    if (!survey) {
      return badRequest(new InvalidParamError('surveyId'))
    }
    return ok({})
  }
}
