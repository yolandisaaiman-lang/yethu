import { NextRequest, NextResponse } from 'next/server';
import { chatAdmin, isConversationMember, requireChatUser } from '@/lib/server/chatAuth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, conversationId } = body as {
      message: any;
      conversationId: string;
    };

    if (!message?.id || !conversationId) {
      return NextResponse.json({ error: 'Missing message or conversationId' }, { status: 400 });
    }
    const user = await requireChatUser(req.headers.get('authorization'));
    if (!user || !isConversationMember(conversationId, user.id) || message.senderId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized message sender' }, { status: 401 });
    }

    const row = {
      id: message.id,
      conversation_id: conversationId,
      sender_id: message.senderId,
      sender_handle: message.senderHandle || '',
      sender_name: message.senderName || '',
      sender_avatar: message.senderAvatar || '',
      country_flag: message.countryFlag || '🌍',
      source_language: message.sourceLanguage || 'English',
      original_text: message.originalText || '',
      translated_text: message.translatedText || message.originalText || '',
      target_language: message.targetLanguage || 'English',
      is_encrypted: Boolean(message.isEncrypted),
      encrypted_payload: message.encryptedPayload || null,
      expires_in: message.expiresIn || null,
      // created_at is set by the DB default (NOW())
    };

    const { error } = await chatAdmin().database.from('chat_messages').insert([row]);
    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error('[chat/send] Unexpected error:', e);
    return NextResponse.json({ ok: false, error: e?.message }, { status: 500 });
  }
}
