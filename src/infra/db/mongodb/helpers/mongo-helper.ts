import { MongoClient, Collection, Document } from 'mongodb'

export const MongoHelper = {
  client: MongoClient,
  uri: '',
  async connect (uri: string): Promise<void> {
    this.uri = uri
    this.client = await MongoClient.connect(uri)
  },
  async disconnect (): Promise<void> {
    if (this.client) {
      await this.client.close()
    }
    this.client = null
  },
  async getCollection (name: string): Promise<Collection> {
    if (!this.client) {
      await this.connect(this.uri)
    }
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
