import { AddAccountParams } from '@/domain/usecases/account/add-account'
import { AccountModel } from '@/domain/models/account'

export interface AddAccountRepository {
  add: (addAccountData: AddAccountParams) => Promise<AccountModel>
}
