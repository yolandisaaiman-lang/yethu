import { NextRequest, NextResponse } from 'next/server';
import { chatAdmin, isConversationMember, requireChatUser } from '@/lib/server/chatAuth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');
    const all = searchParams.get('all') === 'true';
    const since = searchParams.get('since') || new Date(Date.now() - 120_000).toISOString(); // default last 2 min

    if (!conversationId && !all) {
      return NextResponse.json({ error: 'conversationId required' }, { status: 400 });
    }
    const user = await requireChatUser(req.headers.get('authorization'));
    if (!user || (conversationId && !isConversationMember(conversationId, user.id))) {
      return NextResponse.json({ error: 'Unauthorized conversation access' }, { status: 401 });
    }

    let query = chatAdmin().database.from('chat_messages').select('*').gt('created_at', since).order('created_at', { ascending: true }).limit(100);
    query = conversationId
      ? query.eq('conversation_id', conversationId)
      : query.like('conversation_id', `dm_%${user.id}%`);
    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (e: any) {
    console.error('[chat/messages] Unexpected error:', e);
    return NextResponse.json({ error: e?.message || 'Could not load messages' }, { status: 500 });
  }
}
