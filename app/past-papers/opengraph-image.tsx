import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
export const alt = 'COMSATS Past Papers - CampusAxis'
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
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
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
            backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        
        {/* Gradient Orbs */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '5%',
            width: '350px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
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
          {/* Paper Stack Icon */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '40px',
              position: 'relative',
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: '140px',
                  height: '180px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  borderRadius: '12px',
                  position: i === 0 ? 'relative' : 'absolute',
                  left: i === 0 ? '0' : `${i * 15}px`,
                  top: i === 0 ? '0' : `${i * -10}px`,
                  transform: `rotate(${i * 5}deg)`,
                  boxShadow: '0 20px 60px rgba(59, 130, 246, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '20px',
                  opacity: i === 0 ? 1 : 0.6,
                }}
              >
                {i === 0 && (
                  <>
                    <div
                      style={{
                        fontSize: '24px',
                        color: 'white',
                        fontWeight: 'bold',
                        marginBottom: '10px',
                      }}
                    >
                      Q.1
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: '2px',
                        background: 'rgba(255, 255, 255, 0.3)',
                        marginBottom: '8px',
                      }}
                    />
                    <div
                      style={{
                        width: '80%',
                        height: '2px',
                        background: 'rgba(255, 255, 255, 0.3)',
                        marginBottom: '8px',
                      }}
                    />
                    <div
                      style={{
                        width: '90%',
                        height: '2px',
                        background: 'rgba(255, 255, 255, 0.3)',
                      }}
                    />
                  </>
                )}
              </div>
            ))}
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
            Past Papers
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
              <span style={{ color: '#3b82f6', fontSize: '28px' }}>📄</span>
              <span>Midterms</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#3b82f6', fontSize: '28px' }}>📝</span>
              <span>Finals</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#3b82f6', fontSize: '28px' }}>📚</span>
              <span>All Courses</span>
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
