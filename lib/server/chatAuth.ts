import 'server-only';

import { createAdminClient, createClient } from '@insforge/sdk';

const baseUrl = process.env.INSFORGE_URL || process.env.NEXT_PUBLIC_INSFORGE_URL;
const anonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY;
const apiKey = process.env.INSFORGE_API_KEY;

export async function requireChatUser(authorization: string | null) {
  if (!baseUrl || !anonKey || !apiKey) throw new Error('InsForge server environment is not configured');
  const token = authorization?.replace(/^Bearer\s+/i, '').trim();
  if (!token) return null;

  const client = createClient({ baseUrl, anonKey, accessToken: token });
  const { data, error } = await client.auth.getCurrentUser();
  if (error || !data.user) return null;
  return data.user;
}

export function chatAdmin() {
  if (!baseUrl || !apiKey) throw new Error('InsForge server environment is not configured');
  return createAdminClient({ baseUrl, apiKey });
}

export function isConversationMember(conversationId: string, userId: string) {
  const members: string[] = conversationId.match(/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/gi) || [];
  return conversationId.startsWith('dm_') && members.includes(userId);
}
