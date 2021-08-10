import { MongoClient, Collection, Document } from 'mongodb'

export const MongoHelper = {
  client: MongoClient,
  async connect (uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri)
  },
  async disconnect (): Promise<void> {
    await this.client.close()
  },
  getCollection (name: string): Collection {
    return this.client.db().collection(name)
  },
  map<T> (document: any): T {
    const { _id, ...dataWithoutId } = document as Document
    return {
      ...dataWithoutId as T,
      id: _id.toHexString()
    }
  }
}
