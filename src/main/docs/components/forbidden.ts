export const forbidden = {
  description: 'Aceso negado',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
}
