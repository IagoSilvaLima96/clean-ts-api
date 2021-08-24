import { AddSurveyModel } from '@/domain/usecases/add-survey'

export interface AddSurveyRepository {
  add: (addSurveyData: AddSurveyModel) => Promise<void>
}
