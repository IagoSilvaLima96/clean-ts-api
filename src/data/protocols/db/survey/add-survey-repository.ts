import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'

export interface AddSurveyRepository {
  add: (addSurveyData: AddSurveyParams) => Promise<void>
}
