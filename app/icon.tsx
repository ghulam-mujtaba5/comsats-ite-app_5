import { ImageResponse } from 'next/og'
import type { MetadataRoute } from 'next'
 
export const runtime = 'edge'
 
// Image metadata
export const size = {
  width: 512,
  height: 512,
}
export const contentType = 'image/png'
 
// Image generation - Using square logo design
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #6366f1 100%)',
        }}
      >
        {/* Campus building icon */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Stylized C letter */}
          <div
            style={{
              fontSize: 280,
              fontWeight: 'bold',
              color: 'white',
              fontFamily: 'Arial, sans-serif',
              letterSpacing: '-8px',
              textShadow: '0 8px 24px rgba(0,0,0,0.3)',
            }}
          >
            C
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}