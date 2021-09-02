import { AddSurveyParams } from '@/domain/usecases'

export interface AddSurveyRepository {
  add: (addSurveyData: AddSurveyParams) => Promise<void>
}
