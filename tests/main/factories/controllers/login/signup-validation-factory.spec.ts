import { makeSignUpValidation } from '@/main/factories'
import { ValidationComposite, RequiredFieldValidation, EmailValidation, CompareFieldsValidation } from '@/validation/validators'
import { Validation } from '@/presentation/protocols'
import { mockEmailValidator } from '@/tests/validation/mocks'

jest.mock('@/validation/validators/validation-composite')

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email', mockEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
