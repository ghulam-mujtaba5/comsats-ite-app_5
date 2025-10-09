import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
export const alt = 'COMSATS GPA Calculator - CampusAxis'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
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
        {/* Background Grid */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
        
        {/* Gradient Orbs */}
        <div
          style={{
            position: 'absolute',
            top: '5%',
            right: '5%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(60px)',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px',
            textAlign: 'center',
            zIndex: 10,
          }}
        >
          {/* Calculator Icon */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                width: '120px',
                height: '140px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '15px',
                boxShadow: '0 20px 60px rgba(16, 185, 129, 0.3)',
              }}
            >
              <div style={{ fontSize: '32px', color: 'white', marginBottom: '10px' }}>
                4.0
              </div>
              <div
                style={{
                  width: '80px',
                  height: '3px',
                  background: 'rgba(255, 255, 255, 0.5)',
                  marginBottom: '10px',
                }}
              />
              <div
                style={{
                  display: 'flex',
                  gap: '5px',
                  flexWrap: 'wrap',
                  width: '80px',
                  justifyContent: 'center',
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <div
                    key={num}
                    style={{
                      width: '18px',
                      height: '18px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      color: 'white',
                    }}
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: '80px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '20px',
              lineHeight: 1.1,
            }}
          >
            GPA Calculator
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: '36px',
              color: '#94a3b8',
              marginBottom: '40px',
            }}
          >
            COMSATS University Islamabad
          </div>

          {/* Features */}
          <div
            style={{
              display: 'flex',
              gap: '30px',
              fontSize: '22px',
              color: '#64748b',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#10b981', fontSize: '28px' }}>●</span>
              <span>Semester GPA</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#10b981', fontSize: '28px' }}>●</span>
              <span>Cumulative CGPA</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#10b981', fontSize: '28px' }}>●</span>
              <span>Aggregate</span>
            </div>
          </div>
        </div>

        {/* Bottom Brand */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            fontSize: '28px',
            color: '#94a3b8',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 'bold',
              color: 'white',
            }}
          >
            C
          </div>
          <span>CampusAxis</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
