import { AccountModel } from '@/domain/models/account'
import { AddAccountParams, AddAccount } from '@/domain/usecases/account/add-account'
import { AuthenticationParams, Authentication } from '@/domain/usecases/account/authentication'
import { AuthenticationModel } from '@/domain/models/authentication'

export const mockAuthenticationParams = (): AuthenticationParams => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

export const mockAddAccountParams = (): AddAccountParams => ({
  ...mockAuthenticationParams(),
  name: 'any_name'
})

export const mockAccountModel = (): AccountModel => ({
  ...mockAddAccountParams(),
  id: 'any_id',
  password: 'hashed_password'
})

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationParams): Promise<AuthenticationModel> {
      return {
        accessToken: 'any_token',
        name: 'any_name'
      }
    }
  }

  return new AuthenticationStub()
}

export const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (addAccountData: AddAccountParams): Promise<AccountModel | null> {
      return mockAccountModel()
    }
  }
  return new AddAccountStub()
}
