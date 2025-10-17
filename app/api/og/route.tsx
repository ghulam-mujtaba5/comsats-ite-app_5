/**
 * Dynamic Open Graph Image Generator
 * Generates OG images dynamically based on query parameters
 * 
 * Usage: /api/og?title=My Page&description=Page description
 */

import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const title = searchParams.get('title') || 'CampusAxis'
    const description = searchParams.get('description') || 'COMSATS University Islamabad'
    const logo = searchParams.get('logo') === 'true'

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0f1115',
            backgroundImage: 'linear-gradient(135deg, #1a1f27 0%, #0f1115 100%)',
            position: 'relative',
          }}
        >
          {/* Background pattern */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.1,
              backgroundImage: `radial-gradient(circle at 25% 25%, #4573df 0%, transparent 50%),
                               radial-gradient(circle at 75% 75%, #667eea 0%, transparent 50%)`,
            }}
          />

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px',
              maxWidth: '900px',
              textAlign: 'center',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {/* Logo */}
            {logo && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '40px',
                }}
              >
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #4573df 0%, #667eea 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '48px',
                    fontWeight: 'bold',
                    color: 'white',
                  }}
                >
                  C
                </div>
              </div>
            )}

            {/* Title */}
            <div
              style={{
                fontSize: '72px',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '24px',
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
              }}
            >
              {title}
            </div>

            {/* Description */}
            {description && (
              <div
                style={{
                  fontSize: '32px',
                  color: '#a0aec0',
                  lineHeight: 1.4,
                  maxWidth: '700px',
                }}
              >
                {description}
              </div>
            )}

            {/* Brand name */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '60px',
                fontSize: '24px',
                color: '#718096',
              }}
            >
              <span style={{ marginRight: '8px' }}>🎓</span>
              CampusAxis
            </div>
          </div>

          {/* Bottom accent */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '8px',
              background: 'linear-gradient(90deg, #4573df 0%, #667eea 50%, #4573df 100%)',
            }}
          />
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
