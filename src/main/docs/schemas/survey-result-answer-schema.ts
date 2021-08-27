export const surveyResultAnswerSchema = {
  type: 'object',
  properties: {
    answer: {
      type: 'string'
    },
    count: {
      type: 'integer'
    },
    percent: {
      type: 'number'
    }
  },
  required: ['answer', 'count', 'percent']
}
