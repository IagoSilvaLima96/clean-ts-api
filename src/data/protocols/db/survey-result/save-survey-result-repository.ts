import { SaveSurveyResultParams } from '@/domain/usecases'

export interface SaveSurveyResultRepository {
  save: (saveSurveyResultData: SaveSurveyResultParams) => Promise<void>
}
