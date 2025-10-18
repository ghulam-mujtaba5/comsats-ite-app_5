import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
export const alt = 'COMSATS Faculty Reviews - CampusAxis'
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
          background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
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
            backgroundImage: 'radial-gradient(circle at 20px 20px, rgba(139, 92, 246, 0.1) 2%, transparent 0%)',
            backgroundSize: '60px 60px',
          }}
        />
        
        {/* Gradient Orbs */}
        <div
          style={{
            position: 'absolute',
            top: '15%',
            right: '10%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)',
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
          {/* Star Rating Icon */}
          <div
            style={{
              display: 'flex',
              gap: '15px',
              marginBottom: '40px',
            }}
          >
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                style={{
                  width: '60px',
                  height: '60px',
                  color: i <= 4 ? '#fbbf24' : '#4b5563',
                  fontSize: '50px',
                }}
              >
                ★
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
            Faculty Reviews
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: '36px',
              color: '#94a3b8',
              marginBottom: '40px',
            }}
          >
            COMSATS University Professors
          </div>

          {/* Stats */}
          <div
            style={{
              display: 'flex',
              gap: '50px',
              fontSize: '24px',
              color: '#64748b',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '48px',
                  color: '#ec4899',
                  fontWeight: 'bold',
                  marginBottom: '5px',
                }}
              >
                500+
              </div>
              <div>Reviews</div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '48px',
                  color: '#ec4899',
                  fontWeight: 'bold',
                  marginBottom: '5px',
                }}
              >
                100+
              </div>
              <div>Professors</div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '48px',
                  color: '#ec4899',
                  fontWeight: 'bold',
                  marginBottom: '5px',
                }}
              >
                4.5
              </div>
              <div>Avg Rating</div>
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
