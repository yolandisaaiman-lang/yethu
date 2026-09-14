import { NextRequest, NextResponse } from 'next/server';

const INSFORGE_URL = (process.env.NEXT_PUBLIC_INSFORGE_URL || 'https://7rniavv5.us-east.insforge.app').replace(/\/$/, '');
const INSFORGE_KEY = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || 'ik_fbe25dbdbcb2578a0bc8213c1f388426';

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

    const res = await fetch(`${INSFORGE_URL}/api/database/records/chat_messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${INSFORGE_KEY}`,
        'apikey': INSFORGE_KEY,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify([row]),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('[chat/send] InsForge DB error:', res.status, err);
      // Return 200 anyway so the client optimistic update still works
      return NextResponse.json({ ok: false, dbError: err });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error('[chat/send] Unexpected error:', e);
    return NextResponse.json({ ok: false, error: e?.message }, { status: 500 });
  }
}
