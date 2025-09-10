import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// PATCH /api/reviews/:id  | DELETE /api/reviews/:id
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await req.json()
    const cookieStore = await (cookies() as any)
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !anon) return NextResponse.json({ error: 'Supabase env vars missing' }, { status: 500 })
    const supabase = createServerClient(url, anon, {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options?: any) { cookieStore.set({ name, value, ...options }) },
        remove(name: string, options?: any) { cookieStore.set({ name, value: '', ...options }) },
      },
    })
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Auth required' }, { status: 401 })

    const { data: existing, error: exErr } = await supabase.from('reviews').select('*').eq('id', id).maybeSingle()
    if (exErr) throw exErr
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (existing.user_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const allowed = ['comment','pros','cons','rating','teaching_quality','accessibility','course_material','grading','would_recommend','is_anonymous']
    const patch: Record<string, any> = {}
    for (const k of allowed) if (k in body) patch[k] = body[k]
    if (Object.keys(patch).length === 0) return NextResponse.json({ error: 'No valid fields' }, { status: 400 })
    patch.status = 'pending' // re-moderate after edit

    const { error: upErr } = await supabase.from('reviews').update(patch).eq('id', id)
    if (upErr) throw upErr
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed' }, { status: 400 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const cookieStore = await (cookies() as any)
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !anon) return NextResponse.json({ error: 'Supabase env vars missing' }, { status: 500 })
    const supabase = createServerClient(url, anon, {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options?: any) { cookieStore.set({ name, value, ...options }) },
        remove(name: string, options?: any) { cookieStore.set({ name, value: '', ...options }) },
      },
    })
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Auth required' }, { status: 401 })
    const { data: existing, error: exErr } = await supabase.from('reviews').select('id,user_id,faculty_id,status').eq('id', id).maybeSingle()
    if (exErr) throw exErr
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (existing.user_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const { error: delErr } = await supabase.from('reviews').delete().eq('id', id)
    if (delErr) throw delErr
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed' }, { status: 400 })
  }
}
