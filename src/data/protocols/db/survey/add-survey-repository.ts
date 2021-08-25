import { AddSurveyModel } from '@/domain/usecases/survey/add-survey'

export interface AddSurveyRepository {
  add: (addSurveyData: AddSurveyModel) => Promise<void>
}
