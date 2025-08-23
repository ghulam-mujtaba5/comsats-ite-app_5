import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI as string
if (!MONGODB_URI) {
  throw new Error('Missing MONGODB_URI in environment')
}

let cached = (global as any).mongoose as {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null }
}

export async function connectToMongo() {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        serverApi: { version: '1', strict: true, deprecationErrors: true },
      } as any)
      .then((m) => m)
  }

  cached.conn = await cached.promise
  return cached.conn
}
