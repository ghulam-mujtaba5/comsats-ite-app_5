import { NextRequest, NextResponse } from 'next/server'
export async function POST(req: NextRequest){
  try {
    const data = await req.json()
    if(!data?.name || typeof data.value !== 'number') return NextResponse.json({ ok:false }, { status:400 })
    console.log('[web-vitals]', data)
    return NextResponse.json({ ok:true })
  } catch {
    return NextResponse.json({ ok:false }, { status:400 })
  }
}
