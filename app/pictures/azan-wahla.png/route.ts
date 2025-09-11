import { promises as fs } from 'fs'
import path from 'path'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'pictures', 'azan1.png')
    const buffer = await fs.readFile(filePath)
    const ab = new ArrayBuffer(buffer.length)
    new Uint8Array(ab).set(buffer)
    return new Response(ab, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    })
  } catch {
    return new Response('Not Found', { status: 404 })
  }
}
