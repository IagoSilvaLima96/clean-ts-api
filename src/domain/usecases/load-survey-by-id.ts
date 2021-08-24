import { SurveyModel } from '@/domain/models/survey'

export interface LoadSurbeyById {
  loadById: (id: string) => Promise<SurveyModel>
}
