import { DbSaveSurveyResult } from './db-save-survey-result'
import { SaveSurveyResultRepository, SaveSurveyResultParams, SurveyResultModel } from './db-save-survey-result-protocols'
import MockDate from 'mockdate'

const makeFakeSurveyResult = (): SurveyResultModel => ({
  id: 'any_id',
  accountId: 'any_account_id',
  surveyId: 'any_survey_id',
  answer: 'any_answer',
  date: new Date()
})

const makeFakeSaveSurveyResult = (): SaveSurveyResultParams => {
  const { id, ...saveSurveyResult } = makeFakeSurveyResult()
  return saveSurveyResult
}

const makeSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return makeFakeSurveyResult()
    }
  }
  return new SaveSurveyResultRepositoryStub()
}

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepository()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)
  return {
    sut,
    saveSurveyResultRepositoryStub
  }
}

describe('DbSaveSurveyResult UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')
    const saveSurveyResult = makeFakeSaveSurveyResult()
    await sut.save(saveSurveyResult)
    expect(saveSpy).toHaveBeenCalledWith(saveSurveyResult)
  })

  test('Should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.save(makeFakeSaveSurveyResult())
    await expect(promise).rejects.toThrow()
  })

  test('Should return SurveyResult on success', async () => {
    const { sut } = makeSut()
    const surveyResult = await sut.save(makeFakeSaveSurveyResult())
    expect(surveyResult).toEqual(makeFakeSurveyResult())
  })
})
