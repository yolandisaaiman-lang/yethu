import { NextRequest, NextResponse } from 'next/server';

const INSFORGE_URL = (process.env.NEXT_PUBLIC_INSFORGE_URL || 'https://7rniavv5.us-east.insforge.app').replace(/\/$/, '');
const INSFORGE_KEY = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || 'ik_fbe25dbdbcb2578a0bc8213c1f388426';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');
    const since = searchParams.get('since') || new Date(Date.now() - 120_000).toISOString(); // default last 2 min

    if (!conversationId) {
      return NextResponse.json({ error: 'conversationId required' }, { status: 400 });
    }

    // PostgREST query: chat_messages where conversation_id=X AND created_at>since, ordered ascending
    const url = new URL(`${INSFORGE_URL}/api/database/records/chat_messages`);
    url.searchParams.set('conversation_id', `eq.${conversationId}`);
    url.searchParams.set('created_at', `gt.${since}`);
    url.searchParams.set('order', 'created_at.asc');
    url.searchParams.set('limit', '100');

    const res = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${INSFORGE_KEY}`,
        'apikey': INSFORGE_KEY,
        'Accept': 'application/json',
      },
      // Don't cache — always fetch fresh
      cache: 'no-store',
    });

    if (!res.ok) {
      const err = await res.text();
      console.warn('[chat/messages] InsForge DB fetch error:', res.status, err);
      return NextResponse.json([], { status: 200 }); // Return empty so client doesn't break
    }

    const rows = await res.json();
    return NextResponse.json(Array.isArray(rows) ? rows : []);
  } catch (e: any) {
    console.error('[chat/messages] Unexpected error:', e);
    return NextResponse.json([], { status: 200 });
  }
}
