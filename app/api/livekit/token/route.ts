import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      roomName = 'yethu-main',
      identity = `user_${Date.now()}`,
      name = 'Anonymous Afropolitan',
      isPublisher = false,
      metadata = {},
    } = body;

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || 'wss://bible-pal-ph42v7mn.livekit.cloud';

    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        { error: 'LiveKit API credentials missing in .env.local' },
        { status: 500 }
      );
    }

    const now = Math.floor(Date.now() / 1000);
    const ttlSeconds = 60 * 60; // 1 hour token validity (while broadcasts are 120s max)

    const secretKey = new TextEncoder().encode(apiSecret);

    const token = await new SignJWT({
      video: {
        room: roomName,
        roomJoin: true,
        canPublish: Boolean(isPublisher),
        canSubscribe: true,
        canPublishData: true,
      },
      name,
      metadata: typeof metadata === 'string' ? metadata : JSON.stringify(metadata),
    })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuer(apiKey)
      .setSubject(identity)
      .setNotBefore(now - 5)
      .setIssuedAt(now)
      .setExpirationTime(now + ttlSeconds)
      .sign(secretKey);

    return NextResponse.json({
      token,
      serverUrl: livekitUrl,
      roomName,
      identity,
      isPublisher: Boolean(isPublisher),
    });
  } catch (err: any) {
    console.error('Failed to generate LiveKit access token:', err);
    return NextResponse.json(
      { error: err?.message || 'Token generation failed' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const roomName = searchParams.get('room') || 'yethu-main';
  const identity = searchParams.get('identity') || `user_${Date.now()}`;
  const name = searchParams.get('name') || 'Guest';
  const isPublisher = searchParams.get('publisher') === 'true';

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || 'wss://bible-pal-ph42v7mn.livekit.cloud';

  if (!apiKey || !apiSecret) {
    return NextResponse.json(
      { error: 'LiveKit API credentials missing' },
      { status: 500 }
    );
  }

  const now = Math.floor(Date.now() / 1000);
  const secretKey = new TextEncoder().encode(apiSecret);

  const token = await new SignJWT({
    video: {
      room: roomName,
      roomJoin: true,
      canPublish: isPublisher,
      canSubscribe: true,
      canPublishData: true,
    },
    name,
  })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuer(apiKey)
    .setSubject(identity)
    .setNotBefore(now - 5)
    .setIssuedAt(now)
    .setExpirationTime(now + 3600)
    .sign(secretKey);

  return NextResponse.json({
    token,
    serverUrl: livekitUrl,
    roomName,
    identity,
  });
}
