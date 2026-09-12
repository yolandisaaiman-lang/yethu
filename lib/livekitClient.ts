export interface LiveKitTokenResponse {
  token: string;
  serverUrl: string;
  roomName: string;
  identity: string;
  isPublisher: boolean;
}

export async function fetchLiveKitToken(params: {
  roomName: string;
  identity: string;
  name: string;
  isPublisher?: boolean;
}): Promise<LiveKitTokenResponse> {
  const res = await fetch('/api/livekit/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      roomName: params.roomName,
      identity: params.identity,
      name: params.name,
      isPublisher: Boolean(params.isPublisher),
    }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to fetch LiveKit token');
  }

  return res.json();
}
