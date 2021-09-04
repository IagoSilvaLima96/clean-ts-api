import { makeLoginValidation } from '@/main/factories'
import { Validation } from '@/presentation/protocols'
import { ValidationComposite, RequiredFieldValidation, EmailValidation } from '@/validation/validators'
import { mockEmailValidator } from '@/tests/validation/mocks'

jest.mock('@/validation/validators/validation-composite')

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeLoginValidation()
    const validations: Validation[] = []
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', mockEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
