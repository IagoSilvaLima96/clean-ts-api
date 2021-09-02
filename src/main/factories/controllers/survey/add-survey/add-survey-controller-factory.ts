import { makeAddSurveyValidation } from './add-survey-validation-factory'
import { makeLogControllerDecorator, makeDbAddSurvey } from '@/main/factories'
import { Controller } from '@/presentation/protocols'
import { AddSurveyController } from '@/presentation/controllers'

export const makeAddSurveyController = (): Controller => {
  const addSurveyController = new AddSurveyController(makeAddSurveyValidation(), makeDbAddSurvey())
  return makeLogControllerDecorator(addSurveyController)
}
