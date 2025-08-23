/* eslint-disable no-console */
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config({ path: '.env.local' })

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceKey) {
  console.error('Missing Supabase env. Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local')
  process.exit(1)
}

const supabase = createClient(url, serviceKey)

async function main() {
  try {
    console.log('Seeding timetable base rows...')

    const timetableRows = [
      {
        course_code: 'CS101',
        course_title: 'Intro to CS',
        section: 'A',
        day: 'Monday',
        start_time: '09:00',
        end_time: '10:30',
        room: 'A-101',
        teacher_name: 'Dr. Usman',
        department: 'CS',
        semester: 'Fall 2025',
      },
      {
        course_code: 'SE321',
        course_title: 'Web Development',
        section: 'B',
        day: 'Wednesday',
        start_time: '11:00',
        end_time: '12:30',
        room: 'B-203',
        teacher_name: 'Dr. Sobia',
        department: 'SE',
        semester: 'Fall 2025',
      },
    ] as any[]

    const { error: ttErr, data: ttData } = await supabase
      .from('timetable')
      .insert(timetableRows)
      .select()
    if (ttErr) throw ttErr
    console.log(`Inserted timetable rows: ${ttData?.length ?? 0}`)

    console.log('Seeding timetable_docs sample row...')
    const docRow = {
      title: 'Fall 2025 CS Timetable',
      department: 'CS',
      term: 'Fall 2025',
      size_bytes: 123456,
      mime_type: 'application/pdf',
      storage_path: 'timetable/fall-2025/cs.pdf',
      public_url: 'https://example.com/fall-2025/cs.pdf',
    } as any

    const { error: tdErr, data: tdData } = await supabase
      .from('timetable_docs')
      .insert([docRow])
      .select()
    if (tdErr) throw tdErr
    console.log(`Inserted timetable_docs rows: ${tdData?.length ?? 0}`)

    console.log('Done. Visit /api/health/timetable to verify ok: true')
  } catch (e: any) {
    console.error('Seeding failed:', e?.message || e)
    process.exit(1)
  }
}

main()
