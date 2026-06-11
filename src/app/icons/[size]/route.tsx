import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ size: string }> }
) {
  const { size } = await params;
  const sizeNum = parseInt(size.split('x')[0]) || 192;

  return new ImageResponse(
    (
      <div
        style={{
          background: '#0F172A',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: sizeNum >= 512 ? '128px' : '48px',
        }}
      >
        <div
          style={{
            background: '#3B82F6',
            width: '60%',
            height: '60%',
            borderRadius: '20%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ color: 'white', fontSize: sizeNum * 0.35, fontWeight: 900, fontFamily: 'sans-serif' }}>
            M
          </div>
        </div>
      </div>
    ),
    {
      width: sizeNum,
      height: sizeNum,
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    }
  );
}
