import { AccountModel } from '@/domain/models'
import { LoadAccountByToken } from '@/domain/usecases'
import { LoadAccountByTokenRepository, Decrypter } from '@/data/protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load (accessToken: string, role?: string): Promise<AccountModel | null> {
    let token
    try {
      token = await this.decrypter.decrypt(accessToken)
    } catch {
      return null
    }
    if (token) {
      return await this.loadAccountByTokenRepository.loadByToken(accessToken, role)
    }
    return null
  }
}
