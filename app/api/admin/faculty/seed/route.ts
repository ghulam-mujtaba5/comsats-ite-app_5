import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

const COOKIE_NAME = 'ite_admin'

function assertAdmin(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)
  if (token?.value !== '1') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}

export async function POST(req: NextRequest) {
  const unauthorized = assertAdmin(req)
  if (unauthorized) return unauthorized

  try {
    const body = await req.json().catch(() => null)
    if (!body) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })

    // Accept either { ids: string[] } or { faculty: Array<{id:string,name?:string,department?:string,title?:string}> }
    let rows: any[] = []
    if (Array.isArray(body?.ids)) {
      rows = body.ids
        .map((id: any) => (typeof id === 'string' && id.trim() ? id.trim() : null))
        .filter(Boolean)
        .map((id: string) => ({ id, name: `Faculty ${id.slice(0, 6)}`, department: 'Unknown', title: '' }))
    } else if (Array.isArray(body?.faculty)) {
      rows = body.faculty
        .filter((f: any) => f && typeof f.id === 'string' && f.id.trim())
        .map((f: any) => ({
          id: f.id.trim(),
          name: f.name || `Faculty ${f.id.slice(0, 6)}`,
          department: f.department || 'Unknown',
          title: f.title || '',
          email: f.email || null,
          office: f.office || null,
          phone: f.phone || null,
          specialization: f.specialization || [],
          courses: f.courses || [],
          education: f.education || [],
          experience: f.experience || '',
          profile_image: f.profile_image || null,
        }))
    } else {
      return NextResponse.json({ error: 'Provide either ids[] or faculty[]' }, { status: 400 })
    }

    if (rows.length === 0) {
      return NextResponse.json({ error: 'No valid rows provided' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('faculty')
      .upsert(rows, { onConflict: 'id' })
      .select('id,name,department,title')

    if (error) throw error

    return NextResponse.json({ data })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to seed faculty' }, { status: 400 })
  }
}
