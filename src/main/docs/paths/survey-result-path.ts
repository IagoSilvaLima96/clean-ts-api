export const surveyResultPath = {
  put: {
    security: [{
      apiKeyAuth: []
    }],
    tags: ['Enquete'],
    summary: 'API para votar em enquetes',
    parameters: [{
      in: 'path',
      name: 'surveyId',
      required: true
    }],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/saveSurveyResultParams'
          }
        }
      }
    },
    responses: {
      200: {
        description: 'Sucesso',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveyResult'
            }
          }
        }
      },
      400: {
        $ref: '#/components/badRequest'
      },
      401: {
        $ref: '#/components/unauthorized'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  }
}
