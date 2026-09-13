'use client';

export interface DiscoverableContact {
  id: string;
  name: string;
  handle: string;
  email?: string;
  avatar: string;
  country: string;
  countryCode: string;
  countryFlag: string;
  language: string;
  bio: string;
  isCreator?: boolean;
}

export interface ChatInvite {
  id: string;
  senderId: string;
  senderName: string;
  senderHandle: string;
  senderAvatar: string;
  senderCountryFlag: string;
  senderCountry: string;
  senderLanguage: string;
  recipientId: string;
  recipientHandle: string;
  status: 'pending' | 'accepted' | 'rejected';
  greeting?: string;
  createdAt: string;
}

const LOCAL_STORAGE_INVITES_KEY = 'yethu_chat_invites_v1';
const LOCAL_STORAGE_ACCOUNTS_KEY = 'yethu_registered_accounts_v1';
const INVITES_BROADCAST_CHANNEL = 'yethu_realtime_invites';

// List of legacy mock IDs to strip out
const FAKE_ACCOUNT_IDS = new Set(['themba', 'kofi', 'amara', 'fatou', 'juma', 'zola', 'aline']);

function getCountryFlag(countryCode?: string): string {
  switch (countryCode?.toUpperCase()) {
    case 'ZA':
      return '🇿🇦';
    case 'NG':
      return '🇳🇬';
    case 'KE':
      return '🇰🇪';
    case 'GH':
      return '🇬🇭';
    case 'SN':
      return '🇸🇳';
    case 'RW':
      return '🇷🇼';
    default:
      return '🌍';
  }
}

export type InviteEvent =
  | { type: 'INVITE_RECEIVED'; invite: ChatInvite }
  | { type: 'INVITE_ACCEPTED'; invite: ChatInvite }
  | { type: 'INVITE_REJECTED'; inviteId: string };

class ContactInviteService {
  private channel: BroadcastChannel | null = null;
  private listeners: Set<(event: InviteEvent) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.channel = new BroadcastChannel(INVITES_BROADCAST_CHANNEL);
        this.channel.onmessage = (e) => {
          if (e.data) {
            this.notifyListeners(e.data as InviteEvent);
          }
        };
      } catch (err) {
        console.warn('Invites BroadcastChannel unavailable:', err);
      }
    }
  }

  public subscribe(callback: (event: InviteEvent) => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifyListeners(event: InviteEvent) {
    this.listeners.forEach((cb) => {
      try {
        cb(event);
      } catch (e) {
        console.error('Invite event listener error:', e);
      }
    });
  }

  private broadcast(event: InviteEvent) {
    this.notifyListeners(event);
    if (this.channel) {
      try {
        this.channel.postMessage(event);
      } catch (e) {
        console.warn('Failed to broadcast invite event:', e);
      }
    }
  }

  public getAllInvites(): ChatInvite[] {
    if (typeof window === 'undefined') return [];
    try {
      const item = localStorage.getItem(LOCAL_STORAGE_INVITES_KEY);
      if (item) {
        const parsed: ChatInvite[] = JSON.parse(item);
        // Filter out legacy mock accounts so only real user invites appear
        return parsed.filter(
          (inv) => !FAKE_ACCOUNT_IDS.has(inv.senderId) && !FAKE_ACCOUNT_IDS.has(inv.recipientId)
        );
      }
    } catch (e) {
      console.warn('Error reading invites:', e);
    }
    return [];
  }

  private saveAllInvites(invites: ChatInvite[]) {
    if (typeof window === 'undefined') return;
    try {
      const cleaned = invites.filter(
        (inv) => !FAKE_ACCOUNT_IDS.has(inv.senderId) && !FAKE_ACCOUNT_IDS.has(inv.recipientId)
      );
      localStorage.setItem(LOCAL_STORAGE_INVITES_KEY, JSON.stringify(cleaned));
    } catch (e) {
      console.warn('Error saving invites:', e);
    }
  }

  public getPendingInvitesForUser(userId: string, userHandle?: string): ChatInvite[] {
    const all = this.getAllInvites();
    return all.filter((inv) => {
      const matchRecipient =
        inv.recipientId === userId ||
        (userHandle && inv.recipientHandle.toLowerCase() === userHandle.toLowerCase()) ||
        inv.recipientId === 'current_user' ||
        inv.recipientId === 'all';
      return matchRecipient && inv.status === 'pending';
    });
  }

  public sendInvite(params: {
    senderId: string;
    senderName: string;
    senderHandle: string;
    senderAvatar: string;
    senderCountryFlag: string;
    senderCountry: string;
    senderLanguage: string;
    recipientId: string;
    recipientHandle: string;
    greeting?: string;
  }): ChatInvite {
    const all = this.getAllInvites();
    const newInvite: ChatInvite = {
      id: 'inv_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      senderId: params.senderId,
      senderName: params.senderName,
      senderHandle: params.senderHandle,
      senderAvatar: params.senderAvatar,
      senderCountryFlag: params.senderCountryFlag,
      senderCountry: params.senderCountry,
      senderLanguage: params.senderLanguage,
      recipientId: params.recipientId,
      recipientHandle: params.recipientHandle,
      status: 'pending',
      greeting: params.greeting || 'Sawubona! I would love to connect and chat on Yethu.',
      createdAt: new Date().toISOString(),
    };

    all.unshift(newInvite);
    this.saveAllInvites(all);

    this.broadcast({
      type: 'INVITE_RECEIVED',
      invite: newInvite,
    });

    return newInvite;
  }

  public acceptInvite(inviteId: string): ChatInvite | null {
    const all = this.getAllInvites();
    const index = all.findIndex((i) => i.id === inviteId);
    if (index === -1) return null;

    all[index].status = 'accepted';
    this.saveAllInvites(all);

    this.broadcast({
      type: 'INVITE_ACCEPTED',
      invite: all[index],
    });

    return all[index];
  }

  public rejectInvite(inviteId: string): boolean {
    const all = this.getAllInvites();
    const index = all.findIndex((i) => i.id === inviteId);
    if (index === -1) return false;

    all[index].status = 'rejected';
    this.saveAllInvites(all);

    this.broadcast({
      type: 'INVITE_REJECTED',
      inviteId,
    });

    return true;
  }

  /**
   * Search real authenticated users registered in InsForge BaaS and local registry.
   * Excludes fake demo accounts and the current user.
   */
  public async searchContacts(
    query: string,
    currentUserId?: string,
    currentUserEmail?: string
  ): Promise<DiscoverableContact[]> {
    const cleanQuery = query.toLowerCase().trim().replace(/^@/, '');
    const foundMap = new Map<string, DiscoverableContact>();

    // 1. Fetch real authenticated users from InsForge via our server API route
    try {
      const qParam = cleanQuery ? `?q=${encodeURIComponent(cleanQuery)}` : '';
      const uidParam = currentUserId ? `&currentUserId=${encodeURIComponent(currentUserId)}` : '';
      const emailParam = currentUserEmail ? `&currentUserEmail=${encodeURIComponent(currentUserEmail)}` : '';
      const queryStr = cleanQuery
        ? `${qParam}${uidParam}${emailParam}`
        : `?${(uidParam + emailParam).replace(/^&/, '')}`;

      const res = await fetch(`/api/users/search${queryStr}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data?.users)) {
          data.users.forEach((u: DiscoverableContact) => {
            if (!FAKE_ACCOUNT_IDS.has(u.id)) {
              foundMap.set(u.id, u);
            }
          });
        }
      }
    } catch (apiErr) {
      console.warn('InsForge API search notice (combining with local real registry):', apiErr);
    }

    // 2. Also check local registered accounts from this device/browser
    if (typeof window !== 'undefined') {
      try {
        const rawAccounts = localStorage.getItem(LOCAL_STORAGE_ACCOUNTS_KEY);
        if (rawAccounts) {
          const accounts = JSON.parse(rawAccounts);
          Object.values(accounts).forEach((entry: any) => {
            const u = entry?.user;
            if (!u || !u.id || FAKE_ACCOUNT_IDS.has(u.id)) return;
            if (currentUserId && u.id === currentUserId) return;
            if (currentUserEmail && u.email?.toLowerCase() === currentUserEmail.toLowerCase()) return;

            const contact: DiscoverableContact = {
              id: u.id,
              name: u.name || u.email?.split('@')[0] || 'Yethu User',
              handle: u.handle?.startsWith('@') ? u.handle : `@${u.handle || u.name.toLowerCase().replace(/\s+/g, '_')}`,
              email: u.email,
              avatar: u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
              country: u.country || 'South Africa',
              countryCode: u.countryCode || 'ZA',
              countryFlag: getCountryFlag(u.countryCode || 'ZA'),
              language: u.nativeLanguage ? `${u.nativeLanguage} / English` : 'isiXhosa / English',
              bio: u.bio || 'Afropolitan creator on Yethu Live.',
              isCreator: u.isCreator !== false,
            };

            // If already present from InsForge, enrich with local rich metadata
            if (foundMap.has(u.id)) {
              foundMap.set(u.id, { ...foundMap.get(u.id)!, ...contact });
            } else {
              // Match search query
              if (!cleanQuery) {
                foundMap.set(u.id, contact);
              } else {
                const matchName = contact.name.toLowerCase().includes(cleanQuery);
                const matchHandle = contact.handle.toLowerCase().replace('@', '').includes(cleanQuery);
                const matchEmail = contact.email?.toLowerCase().includes(cleanQuery);
                const matchCountry = contact.country.toLowerCase().includes(cleanQuery);
                const matchLanguage = contact.language.toLowerCase().includes(cleanQuery);
                if (matchName || matchHandle || matchEmail || matchCountry || matchLanguage) {
                  foundMap.set(u.id, contact);
                }
              }
            }
          });
        }
      } catch (localErr) {
        console.warn('Error reading local accounts:', localErr);
      }
    }

    return Array.from(foundMap.values()).filter((c) => {
      if (currentUserId && c.id === currentUserId) return false;
      if (currentUserEmail && c.email?.toLowerCase() === currentUserEmail.toLowerCase()) return false;
      return true;
    });
  }

  public seedWelcomeInvite(_userId: string, _userHandle: string) {
    // No-op: Removed fake accounts and welcome invites
  }
}

export const contactInviteService = new ContactInviteService();
