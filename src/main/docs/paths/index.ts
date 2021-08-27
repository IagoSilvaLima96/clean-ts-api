import { loginPath } from './login-path'
import { surveyPath } from './survey-path'
import { signupPath } from './signup-path'
import { surveyResultPath } from './survey-result-path'

export const paths = {
  '/login': loginPath,
  '/signup': signupPath,
  '/surveys': surveyPath,
  '/surveys/{surveyId}/results': surveyResultPath
}

export const teste = 'iagos'
