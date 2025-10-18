import { MongoClient } from 'mongodb'

let client: MongoClient | null = null
let promise: Promise<MongoClient> | undefined

export function getMongoClient(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI is not set')
  if (client) return Promise.resolve(client)
  if (!promise) {
    promise = new MongoClient(uri, {
      serverApi: { version: '1', strict: true, deprecationErrors: true } as any,
    })
      .connect()
      .then((c: MongoClient) => {
        client = c
        return c
      })
  }
  return promise as Promise<MongoClient>
}

export async function getMongoDb(dbName?: string) {
  const c = await getMongoClient()
  return c.db(dbName || process.env.MONGODB_DB || 'campusaxis0')
}
