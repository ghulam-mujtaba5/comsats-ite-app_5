import { ImageResponse } from 'next/og'
import styles from './apple-icon.module.css';
 
export const runtime = 'edge'
 
export const size = {
  width: 180,
  height: 180,
}
 
export const contentType = 'image/png'
 
export default function AppleTouchIcon() {
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
              fontSize: 98,
              fontWeight: 'bold',
              color: 'white',
              fontFamily: 'Arial, sans-serif',
              letterSpacing: '-3px',
              textShadow: '0 4px 12px rgba(0,0,0,0.3)',
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
