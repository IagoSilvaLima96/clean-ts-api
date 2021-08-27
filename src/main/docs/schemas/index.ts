import { accountSchema } from './account-schema'
import { errorSchema } from './error-schema'
import { loginParamsSchema } from './login-params-schema'
import { surveyAnswerSchema } from './survey-answer-schema'
import { surveySchema } from './survey-schema'
import { surveysSchema } from './surveys-schema'
import { signupParamsSchema } from './signup-params-schema'
import { addSurveyParamsSchema } from './add-survey-params-schema'
import { saveSurveyResultParamsSchema } from './save-survey-result-params-schema'
import { surveyResultSchema } from './survey-result-schema'
import { surveyResultAnswerSchema } from './survey-result-answer-schema'

export * from './api-key-auth-schema'

export const schemas = {
  account: accountSchema,
  loginParams: loginParamsSchema,
  error: errorSchema,
  surveys: surveysSchema,
  survey: surveySchema,
  surveyAnswer: surveyAnswerSchema,
  signupParams: signupParamsSchema,
  addSurveyParams: addSurveyParamsSchema,
  saveSurveyResultParams: saveSurveyResultParamsSchema,
  surveyResult: surveyResultSchema,
  surveyResultAnswer: surveyResultAnswerSchema
}
