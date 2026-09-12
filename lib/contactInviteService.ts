'use client';

export interface DiscoverableContact {
  id: string;
  name: string;
  handle: string;
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
const INVITES_BROADCAST_CHANNEL = 'yethu_realtime_invites';

// Curated African creator directory for discovery
export const DISCOVERABLE_CONTACTS: DiscoverableContact[] = [
  {
    id: 'themba',
    name: 'Themba Khumalo',
    handle: '@themba_beats',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
    country: 'South Africa',
    countryCode: 'ZA',
    countryFlag: '🇿🇦',
    language: 'isiZulu',
    bio: 'Amapiano producer, sound designer & live 120s host from Soweto.',
    isCreator: true,
  },
  {
    id: 'kofi',
    name: 'Kofi Mensah',
    handle: '@kofi_accra',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    country: 'Ghana',
    countryCode: 'GH',
    countryFlag: '🇬🇭',
    language: 'Twi / English',
    bio: 'Tech founder & Highlife broadcast streamer in Accra.',
    isCreator: true,
  },
  {
    id: 'amara',
    name: 'Amara Balogun',
    handle: '@amara_lagos',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&auto=format&fit=crop&q=80',
    country: 'Nigeria',
    countryCode: 'NG',
    countryFlag: '🇳🇬',
    language: 'Yorùbá',
    bio: 'Lagos creative arts director, Afro-fusion storyteller.',
    isCreator: true,
  },
  {
    id: 'fatou',
    name: 'Fatou Diop',
    handle: '@fatou_dakar',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    country: 'Senegal',
    countryCode: 'SN',
    countryFlag: '🇸🇳',
    language: 'Wolof / Français',
    bio: 'Dakar contemporary fashion designer & culture host.',
    isCreator: true,
  },
  {
    id: 'juma',
    name: 'Juma Kimani',
    handle: '@juma_ke',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    country: 'Kenya',
    countryCode: 'KE',
    countryFlag: '🇰🇪',
    language: 'Kiswahili',
    bio: 'Silicon Savannah WebRTC engineer & Nairobi community leader.',
    isCreator: true,
  },
  {
    id: 'zola',
    name: 'Zola Ndlovu',
    handle: '@zola_dbn',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    country: 'South Africa',
    countryCode: 'ZA',
    countryFlag: '🇿🇦',
    language: 'isiXhosa',
    bio: 'Durban coastal music and dance creator.',
    isCreator: true,
  },
  {
    id: 'aline',
    name: 'Aline Uwase',
    handle: '@aline_kgl',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    country: 'Rwanda',
    countryCode: 'RW',
    countryFlag: '🇷🇼',
    language: 'Kinyarwanda',
    bio: 'Kigali digital innovation advocate and media creator.',
    isCreator: true,
  },
];

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
        return JSON.parse(item);
      }
    } catch (e) {
      console.warn('Error reading invites:', e);
    }
    return [];
  }

  private saveAllInvites(invites: ChatInvite[]) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(LOCAL_STORAGE_INVITES_KEY, JSON.stringify(invites));
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

    // Auto-respond simulation if inviting a registered creator
    if (['themba', 'kofi', 'amara', 'fatou', 'juma', 'zola', 'aline'].includes(params.recipientId)) {
      setTimeout(() => {
        this.acceptInvite(newInvite.id);
      }, 4000);
    }

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

  public searchContacts(query: string, currentUserId?: string): DiscoverableContact[] {
    const cleanQuery = query.toLowerCase().trim();
    return DISCOVERABLE_CONTACTS.filter((contact) => {
      if (currentUserId && contact.id === currentUserId) return false;
      if (!cleanQuery) return true;
      return (
        contact.name.toLowerCase().includes(cleanQuery) ||
        contact.handle.toLowerCase().includes(cleanQuery) ||
        contact.country.toLowerCase().includes(cleanQuery) ||
        contact.language.toLowerCase().includes(cleanQuery) ||
        contact.bio.toLowerCase().includes(cleanQuery)
      );
    });
  }

  public seedWelcomeInvite(userId: string, userHandle: string) {
    const existing = this.getAllInvites();
    const hasExisting = existing.some((i) => i.recipientId === userId || i.recipientHandle === userHandle);
    if (hasExisting) return;

    const welcomeInvite: ChatInvite = {
      id: 'inv_welcome_' + Date.now(),
      senderId: 'themba',
      senderName: 'Themba Khumalo',
      senderHandle: '@themba_beats',
      senderAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
      senderCountryFlag: '🇿🇦',
      senderCountry: 'South Africa',
      senderLanguage: 'isiZulu',
      recipientId: userId,
      recipientHandle: userHandle,
      status: 'pending',
      greeting: 'Sawubona! Welcome to Yethu. Would love to connect and share some 120s studio live streams with you!',
      createdAt: new Date().toISOString(),
    };

    existing.unshift(welcomeInvite);
    this.saveAllInvites(existing);

    setTimeout(() => {
      this.broadcast({
        type: 'INVITE_RECEIVED',
        invite: welcomeInvite,
      });
    }, 800);
  }
}

export const contactInviteService = new ContactInviteService();
