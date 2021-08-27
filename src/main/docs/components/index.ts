import { badRequest } from './bad-request'
import { serverError } from './server-error'
import { unauthorized } from './unauthorized'
import { forbidden } from './forbidden'
import { apiKeyAuthSchema } from '../schemas'

export const components = {
  securitySchemes: {
    apiKeyAuth: apiKeyAuthSchema
  },
  badRequest,
  serverError,
  unauthorized,
  forbidden
}
