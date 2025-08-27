/* eslint-disable no-console */
import { config } from 'dotenv'
import fs from 'node:fs'
import path from 'node:path'
import { setTimeout as sleep } from 'node:timers/promises'

// Load env from .env.local (never commit service role key)
config({ path: '.env.local' })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

async function fetchMeta(endpoint, params, { retries = 3, timeoutMs = 30000 } = {}) {
  const qs = params ? `?${new URLSearchParams(params).toString()}` : ''
  const url = `${SUPABASE_URL.replace(/\/$/, '')}/pg${endpoint}${qs}`
  let attempt = 0
  while (true) {
    attempt++
    const controller = new AbortController()
    const to = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const res = await fetch(url, {
        headers: {
          apikey: SERVICE_KEY,
          Authorization: `Bearer ${SERVICE_KEY}`,
        },
        signal: controller.signal,
      })
      if (!res.ok) {
        const body = await res.text().catch(() => '')
        throw new Error(`${endpoint} failed: ${res.status} ${body}`)
      }
      return await res.json()
    } catch (err) {
      if (attempt > retries) throw err
      const backoff = Math.min(5000, 500 * attempt)
      console.warn(`Fetch ${endpoint} attempt ${attempt} failed, retrying in ${backoff}ms...`)
      await sleep(backoff)
    } finally {
      clearTimeout(to)
    }
  }
}

async function main() {
  const [tables, columns] = await Promise.all([
    fetchMeta('/tables', { included_schemas: 'public' }),
    fetchMeta('/columns', { included_schemas: 'public' }),
  ])

  const out = { generatedAt: new Date().toISOString(), tables, columns }
  const outFile = path.join(process.cwd(), 'schema.public.json')
  fs.writeFileSync(outFile, JSON.stringify(out, null, 2))
  console.log(`Public schema written to ${outFile} (tables: ${tables?.length ?? 0}, columns: ${columns?.length ?? 0})`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
