import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function DELETE(request: Request) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !anon) {
      return NextResponse.json({ error: 'Supabase env missing' }, { status: 500 })
    }

    // Expect Authorization: Bearer <access_token>
    const auth = request.headers.get('authorization') || request.headers.get('Authorization')
    const token = auth?.startsWith('Bearer ') ? auth.slice('Bearer '.length) : undefined
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify token and get user via anon client
    const supabase = createClient(url, anon)
    const { data: userData, error: userErr } = await supabase.auth.getUser(token)
    if (userErr || !userData?.user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const userId = userData.user.id

    // Delete auth user via admin client
    const { error: delErr } = await supabaseAdmin.auth.admin.deleteUser(userId)
    if (delErr) {
      return NextResponse.json({ error: delErr.message }, { status: 500 })
    }

    return new NextResponse(null, { status: 204 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 })
  }
}
