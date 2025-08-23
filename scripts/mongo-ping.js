/* eslint-disable no-console */
const mongoose = require('mongoose')
require('dotenv').config({ path: '.env.local' })

const uri = process.env.MONGODB_URI
if (!uri) {
  console.error('Missing MONGODB_URI in .env.local')
  process.exit(1)
}

async function run() {
  try {
    await mongoose.connect(uri, { serverApi: { version: '1', strict: true, deprecationErrors: true } })
    await mongoose.connection.db.admin().command({ ping: 1 })
    console.log('Pinged your deployment. You successfully connected to MongoDB!')
  } catch (err) {
    console.error('MongoDB ping failed:', err?.message || err)
    process.exitCode = 1
  } finally {
    await mongoose.disconnect()
  }
}

run()
