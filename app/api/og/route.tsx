/* eslint-disable @next/next/no-inline-style */
/**
 * Dynamic Open Graph Image Generator
 * Generates OG images dynamically based on query parameters
 * 
 * Usage: /api/og?title=My Page&description=Page description
 */

import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

declare module 'react' {
  interface HTMLAttributes<T> {
    tw?: string
  }
}

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const title = searchParams.get('title') || 'CampusAxis'
    const description = searchParams.get('description') || 'COMSATS University Islamabad'
    const logo = searchParams.get('logo') === 'true'

    return new ImageResponse(
      (
        <div tw="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#0f1115] text-white">
          <div tw="absolute inset-0 bg-gradient-to-br from-[#1a1f27] to-transparent" />
          <div tw="absolute inset-0 opacity-40 blur-3xl bg-[radial-gradient(circle_at_25%_25%,rgba(69,115,223,0.45),transparent_60%)]" />
          <div tw="absolute inset-0 opacity-30 blur-[160px] bg-[radial-gradient(circle_at_70%_75%,rgba(102,126,234,0.55),transparent_65%)]" />

          <div tw="relative flex max-w-[900px] flex-col items-center justify-center px-16 py-[60px] text-center">
            {logo && (
              <div tw="mb-10 flex items-center justify-center">
                <div tw="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4573df] to-[#667eea] text-5xl font-bold text-white">
                  C
                </div>
              </div>
            )}

            <div tw="text-[72px] font-bold leading-tight tracking-[-0.02em] text-white">
              {title}
            </div>

            {description && (
              <div tw="mt-6 max-w-[700px] text-[32px] leading-snug text-[#a0aec0]">
                {description}
              </div>
            )}

            <div tw="mt-12 flex items-center gap-3 text-[24px] text-[#718096]">
              <span tw="text-[32px]">🎓</span>
              <span>CampusAxis</span>
            </div>
          </div>

          <div tw="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#4573df] via-[#667eea] to-[#4573df]" />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (error) {
    console.error('Error generating OG image:', error)
    return new Response('Failed to generate image', { status: 500 })
  }
}
