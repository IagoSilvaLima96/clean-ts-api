
import { AccountMongoRepository } from './account-mongo-repository'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { mockAddAccountParams } from '@/domain/test'
import { Collection } from 'mongodb'
describe('Account Mongo Repository', () => {
  let accountCollection: Collection
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  describe('add()', () => {
    test('Should return an account on add success', async () => {
      const sut = makeSut()
      const addAccountParams = mockAddAccountParams()
      const account = await sut.add(addAccountParams)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(addAccountParams.name)
      expect(account.email).toBe(addAccountParams.email)
      expect(account.password).toBe(addAccountParams.password)
    })
  })

  describe('loadByEmail()', () => {
    test('Should return an account on loadByEmail success', async () => {
      const sut = makeSut()
      const addAccountParams = mockAddAccountParams()
      await accountCollection.insertOne(addAccountParams)
      const account = await sut.loadByEmail(addAccountParams.email)
      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
      expect(account?.name).toBe(addAccountParams.name)
      expect(account?.email).toBe(addAccountParams.email)
      expect(account?.password).toBe(addAccountParams.password)
    })

    test('Should return null if loadByEmail fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByEmail('any_email@mail.com')
      expect(account).toBeFalsy()
    })
  })

  describe('updateAccessToken()', () => {
    test('Should update the account accessToken on updateAccessToken success', async () => {
      const sut = makeSut()
      const { insertedId: id } = await accountCollection.insertOne(mockAddAccountParams())
      let fakeAccount = await accountCollection.findOne({ _id: id })
      expect(fakeAccount?.accessToken).toBeFalsy()
      await sut.updateAccessToken(id.toHexString(), 'any_token')
      fakeAccount = await accountCollection.findOne({ _id: id })
      expect(fakeAccount).toBeTruthy()
      expect(fakeAccount?.accessToken).toBe('any_token')
    })
  })

  describe('loadByToken()', () => {
    test('Should return an account on loadByToken without role', async () => {
      const sut = makeSut()
      const addAccountParamsWithToken = {
        ...mockAddAccountParams(),
        accessToken: 'any_token'
      }
      await accountCollection.insertOne(addAccountParamsWithToken)
      const account = await sut.loadByToken(addAccountParamsWithToken.accessToken)
      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
      expect(account?.name).toBe(addAccountParamsWithToken.name)
      expect(account?.email).toBe(addAccountParamsWithToken.email)
      expect(account?.password).toBe(addAccountParamsWithToken.password)
    })

    test('Should return an account on loadByToken with admin role', async () => {
      const sut = makeSut()
      const addAccountParamsWithTokenAndRole = {
        ...mockAddAccountParams(),
        accessToken: 'any_token',
        role: 'admin'
      }
      await accountCollection.insertOne(addAccountParamsWithTokenAndRole)
      const account = await sut.loadByToken(addAccountParamsWithTokenAndRole.accessToken, addAccountParamsWithTokenAndRole.role)
      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
      expect(account?.name).toBe(addAccountParamsWithTokenAndRole.name)
      expect(account?.email).toBe(addAccountParamsWithTokenAndRole.email)
      expect(account?.password).toBe(addAccountParamsWithTokenAndRole.password)
    })

    test('Should return null on loadByToken with invalid role', async () => {
      const sut = makeSut()
      const addAccountParamsWithToken = {
        ...mockAddAccountParams(),
        accessToken: 'any_token'
      }
      await accountCollection.insertOne(addAccountParamsWithToken)
      const account = await sut.loadByToken(addAccountParamsWithToken.accessToken, 'admin')
      expect(account).toBeFalsy()
    })

    test('Should return an account on loadByToken with if user is admin', async () => {
      const sut = makeSut()
      const addAccountParamsWithTokenAndRole = {
        ...mockAddAccountParams(),
        accessToken: 'any_token',
        role: 'admin'
      }
      await accountCollection.insertOne(addAccountParamsWithTokenAndRole)
      const account = await sut.loadByToken(addAccountParamsWithTokenAndRole.accessToken)
      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
      expect(account?.name).toBe(addAccountParamsWithTokenAndRole.name)
      expect(account?.email).toBe(addAccountParamsWithTokenAndRole.email)
      expect(account?.password).toBe(addAccountParamsWithTokenAndRole.password)
    })

    test('Should return null if loadByToken fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByToken('any_token')
      expect(account).toBeFalsy()
    })
  })
})
