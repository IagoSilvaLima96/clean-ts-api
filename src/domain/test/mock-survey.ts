import { SurveyModel } from '@/domain/models/survey'
import { AddSurveyParams, AddSurvey } from '@/domain/usecases/survey/add-survey'
import { LoadSurveys } from '@/domain/usecases/survey/load-surveys'
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'

export const mockSurveyModels = (): SurveyModel[] => [{
  id: 'any_id',
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
}, {
  id: 'other_id',
  question: 'other_question',
  answers: [{
    image: 'other_image',
    answer: 'other_answer'
  }],
  date: new Date()
}]

export const mockSurveyModel = (): SurveyModel => ({
  id: 'other_id',
  question: 'other_question',
  answers: [{
    image: 'other_image',
    answer: 'other_answer'
  }, {
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
})

export const mockAddSurveyParams = (): AddSurveyParams => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }, {
    image: 'other_image',
    answer: 'other_answer'
  }, {
    image: 'whatever_image',
    answer: 'whatever_answer'
  }, {
    answer: 'valid_answer'
  }],
  date: new Date()
})

export const mockAddSurveysParams = (): AddSurveyParams[] => [
  mockAddSurveyParams(),
  {
    question: 'other_question',
    answers: [{
      image: 'other_image',
      answer: 'other_answer'
    }],
    date: new Date()
  }
]

export const mockAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (addSurveyData: AddSurveyParams): Promise<void> { }
  }
  return new AddSurveyStub()
}

export const mockLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load (): Promise<SurveyModel[]> {
      return mockSurveyModels()
    }
  }
  return new LoadSurveysStub()
}

export const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel> {
      return mockSurveyModel()
    }
  }
  return new LoadSurveyByIdStub()
}
