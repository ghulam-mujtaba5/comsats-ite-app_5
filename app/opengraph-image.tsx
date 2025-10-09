import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
export const alt = 'CampusAxis - COMSATS University Islamabad'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  // Fetch the SVG logo
  const logoSvg = await fetch(
    new URL('../../public/logo-square.svg', import.meta.url)
  ).then((res) => res.arrayBuffer())

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #6366f1 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui',
          position: 'relative',
        }}
      >
        {/* Background Pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.08) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(255, 255, 255, 0.08) 2%, transparent 0%)',
            backgroundSize: '100px 100px',
          }}
        />
        
        {/* Gradient Orbs - Enhanced */}
        <div
          style={{
            position: 'absolute',
            top: '5%',
            left: '5%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(251, 191, 36, 0.2) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(60px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '5%',
            right: '5%',
            width: '450px',
            height: '450px',
            background: 'radial-gradient(circle, rgba(147, 51, 234, 0.2) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(60px)',
          }}
        />

        {/* Content Container */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '60px 80px',
            width: '100%',
            maxWidth: '1120px',
            zIndex: 10,
          }}
        >
          {/* Left Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              flex: 1,
            }}
          >
            {/* Main Title */}
            <div
              style={{
                fontSize: '68px',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '16px',
                lineHeight: 1.1,
                textShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              }}
            >
              CampusAxis
            </div>

            {/* Tagline */}
            <div
              style={{
                fontSize: '28px',
                color: 'rgba(255, 255, 255, 0.95)',
                marginBottom: '32px',
                maxWidth: '580px',
                lineHeight: 1.3,
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
              }}
            >
              Your Ultimate Academic Portal for COMSATS University
            </div>

            {/* Features */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                fontSize: '20px',
                color: 'rgba(255, 255, 255, 0.9)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                  width: '6px', 
                  height: '6px', 
                  borderRadius: '50%', 
                  background: '#fbbf24',
                  boxShadow: '0 0 8px rgba(251, 191, 36, 0.6)'
                }} />
                <span>GPA Calculator & Academic Tools</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                  width: '6px', 
                  height: '6px', 
                  borderRadius: '50%', 
                  background: '#fbbf24',
                  boxShadow: '0 0 8px rgba(251, 191, 36, 0.6)'
                }} />
                <span>Past Papers & Study Resources</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                  width: '6px', 
                  height: '6px', 
                  borderRadius: '50%', 
                  background: '#fbbf24',
                  boxShadow: '0 0 8px rgba(251, 191, 36, 0.6)'
                }} />
                <span>Faculty Reviews & Timetables</span>
              </div>
            </div>
          </div>

          {/* Right - Logo Display */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: '40px',
            }}
          >
            <div
              style={{
                width: '280px',
                height: '280px',
                borderRadius: '32px',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              }}
            >
              <img
                src={`data:image/svg+xml;base64,${Buffer.from(logoSvg).toString('base64')}`}
                width="240"
                height="240"
                alt="CampusAxis Logo"
                style={{
                  borderRadius: '24px',
                }}
              />
            </div>
          </div>
        </div>

        {/* Bottom Bar - Enhanced */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '12px',
            background: 'linear-gradient(to right, #fbbf24 0%, #f59e0b 50%, #fbbf24 100%)',
            boxShadow: '0 -2px 20px rgba(251, 191, 36, 0.4)',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}
