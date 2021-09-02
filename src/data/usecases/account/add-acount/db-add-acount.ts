
import { AccountModel } from '@/domain/models'
import { AddAccountParams, AddAccount } from '@/domain/usecases'
import { Hasher, AddAccountRepository, LoadAccountByEmailRepository } from '@/data/protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) { }

  async add (addAccountData: AddAccountParams): Promise<AccountModel | null> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(addAccountData.email)
    if (account) {
      return null
    }
    const hashedPassword = await this.hasher.hash(addAccountData.password)
    const newAccount = await this.addAccountRepository.add({ ...addAccountData, password: hashedPassword })
    return newAccount
  }
}
