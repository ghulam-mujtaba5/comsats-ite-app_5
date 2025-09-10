import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
	try {
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

		const { data, error } = await supabase
			.from('reviews')
			.select('*')
			.eq('user_id', user.id)
			.order('created_at', { ascending: false })
			.limit(200)
		if (error) throw error
		return NextResponse.json({ data })
	} catch (e: any) {
		return NextResponse.json({ error: e.message || 'Failed' }, { status: 400 })
	}
}
