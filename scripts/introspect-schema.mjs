/* eslint-disable no-console */
import { config } from 'dotenv'
import fs from 'node:fs'
import path from 'node:path'
import { setTimeout as sleep } from 'node:timers/promises'

// Load env from .env.local (never commit service role key)
config({ path: '.env.local' })

// Normalize URL: ensure it's the base project URL (e.g. https://xyz.supabase.co)
// Remove trailing slash and any '/rest/v1' suffix if mistakenly provided
const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_URL = rawUrl.replace(/\/?rest\/v1\/?$/, '').replace(/\/$/, '')
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

async function fetchMeta(endpoint, params, { retries = 4, timeoutMs = 60000 } = {}) {
  const qs = params ? `?${new URLSearchParams(params).toString()}` : ''
  const url = `${SUPABASE_URL}/pg${endpoint}${qs}`
  console.log('GET', url)
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
      const backoff = Math.min(8000, 1000 * attempt)
      console.warn(`Fetch ${endpoint} attempt ${attempt} failed, retrying in ${backoff}ms...`)
      await sleep(backoff)
    } finally {
      clearTimeout(to)
    }
  }
}

async function main() {
  const [tables, columns] = await Promise.all([
    fetchMeta('/meta/tables', { included_schemas: 'public' }),
    fetchMeta('/meta/columns', { included_schemas: 'public' }),
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
