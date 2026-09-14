'use client';

import { insforge } from './insforge';
import { ChatMessage, Conversation } from './chatData';
import { encryptOneOnOneMessage, decryptOneOnOneMessage, isEncryptedMessage } from './crypto';

const LOCAL_STORAGE_CHATS_KEY = 'yethu_conversations_v1';
const BROADCAST_CHANNEL_NAME = 'yethu_realtime_chats';

// The single InsForge realtime channel every Yethu user subscribes to.
// Per-conversation isolation is handled by the conversationId inside the payload.
const INSFORGE_CHANNEL = 'yethu_chat_v1';
const INSFORGE_EVENT = 'chat:event';

export type RealtimeChatEvent =
  | { type: 'NEW_MESSAGE'; conversationId: string; message: ChatMessage }
  | { type: 'TYPING'; conversationId: string; userId: string; userName: string; isTyping: boolean }
  | { type: 'CONVERSATION_UPDATED'; conversation: Conversation };

class RealtimeChatService {
  private broadcastChannel: BroadcastChannel | null = null;
  private listeners: Set<(event: RealtimeChatEvent) => void> = new Set();
  private isConnected: boolean = false;
  private connectPromise: Promise<void> | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      // ── Same-tab / multi-tab sync via BroadcastChannel ──────────────────
      try {
        this.broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        this.broadcastChannel.onmessage = (e) => {
          if (e.data) this.notifyListeners(e.data as RealtimeChatEvent);
        };
      } catch (err) {
        console.warn('[Yethu Realtime] BroadcastChannel not supported:', err);
      }

      // ── Cross-device sync via InsForge Realtime ──────────────────────────
      this.connectPromise = this.initInsForge();
    }
  }

  private async initInsForge(): Promise<void> {
    try {
      if (!insforge?.realtime) return;

      // 1. Connect the WebSocket
      await insforge.realtime.connect();

      // 2. Subscribe to the shared Yethu chat channel
      const result = await insforge.realtime.subscribe(INSFORGE_CHANNEL);
      if (!result.ok) {
        console.warn('[Yethu Realtime] Channel subscribe failed:', result.error);
        return;
      }

      // 3. Listen for inbound events from other devices
      insforge.realtime.on(INSFORGE_EVENT, (payload: any) => {
        if (payload) this.notifyListeners(payload as RealtimeChatEvent);
      });

      this.isConnected = true;
      console.info('[Yethu Realtime] Connected ✓ channel:', INSFORGE_CHANNEL);
    } catch (e) {
      console.info('[Yethu Realtime] Falling back to BroadcastChannel only:', e);
    }
  }

  // ── Subscribe to events ────────────────────────────────────────────────
  public subscribe(callback: (event: RealtimeChatEvent) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners(event: RealtimeChatEvent) {
    this.listeners.forEach((cb) => {
      try { cb(event); } catch (e) { console.error('[Yethu Realtime] Listener error:', e); }
    });
  }

  // ── Broadcast an event to all peers (same tab, other tabs, other devices) ──
  public async broadcast(event: RealtimeChatEvent): Promise<void> {
    // 1. Notify listeners in THIS tab immediately
    this.notifyListeners(event);

    // 2. Push to other tabs on the same browser
    try {
      this.broadcastChannel?.postMessage(event);
    } catch (e) {
      console.warn('[Yethu Realtime] BroadcastChannel post failed:', e);
    }

    // 3. Push cross-device via InsForge WebSocket
    if (this.isConnected && insforge?.realtime) {
      try {
        await insforge.realtime.publish(INSFORGE_CHANNEL, INSFORGE_EVENT, event);
      } catch (err) {
        console.warn('[Yethu Realtime] InsForge publish failed (will retry on next message):', err);
        // Attempt reconnect for next time
        this.isConnected = false;
        this.connectPromise = this.initInsForge();
      }
    }
  }

  // ── Typing indicator helpers ─────────────────────────────────────────────
  private typingTimers: Map<string, ReturnType<typeof setTimeout>> = new Map();

  /**
   * Call this whenever the local user's input changes.
   * Sends a TYPING=true event, then auto-clears after 2.5 s of inactivity.
   */
  public broadcastTyping(conversationId: string, userId: string, userName: string) {
    // Debounce: cancel the previous clear timer
    const existing = this.typingTimers.get(conversationId);
    if (existing) clearTimeout(existing);

    // Send "isTyping: true"
    this.broadcast({ type: 'TYPING', conversationId, userId, userName, isTyping: true });

    // After 2.5 s without a new keystroke, auto-send "isTyping: false"
    const timer = setTimeout(() => {
      this.broadcast({ type: 'TYPING', conversationId, userId, userName, isTyping: false });
      this.typingTimers.delete(conversationId);
    }, 2500);

    this.typingTimers.set(conversationId, timer);
  }

  /** Call on explicit send (clears typing immediately). */
  public clearTyping(conversationId: string, userId: string, userName: string) {
    const existing = this.typingTimers.get(conversationId);
    if (existing) {
      clearTimeout(existing);
      this.typingTimers.delete(conversationId);
    }
    this.broadcast({ type: 'TYPING', conversationId, userId, userName, isTyping: false });
  }

  // ── Persistence helpers ──────────────────────────────────────────────────
  public loadStoredConversations(fallback: Conversation[]): Conversation[] {
    if (typeof window === 'undefined') return fallback;
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_CHATS_KEY);
      if (stored) {
        const parsed: Conversation[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const cleaned = this.purgeDummies(parsed);
          if (cleaned.length !== parsed.length) {
            localStorage.setItem(LOCAL_STORAGE_CHATS_KEY, JSON.stringify(cleaned));
          }
          return cleaned.length > 0 ? cleaned : fallback;
        }
      }
    } catch (e) {
      console.warn('[Yethu Realtime] Could not parse stored conversations:', e);
    }
    return fallback;
  }

  public saveConversations(conversations: Conversation[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(LOCAL_STORAGE_CHATS_KEY, JSON.stringify(this.purgeDummies(conversations)));
    } catch (e) {
      console.warn('[Yethu Realtime] Could not persist conversations:', e);
    }
  }

  private purgeDummies(conversations: Conversation[]): Conversation[] {
    const DUMMY_IDS = new Set(['conv_themba_direct', 'conv_kofi_direct', 'conv_amara_direct']);
    const DUMMY_PARTICIPANTS = new Set(['themba', 'kofi', 'amara', 'fatou', 'juma', 'zola', 'aline', 'u_themba', 'u_kofi', 'u_amara']);
    const DUMMY_TITLES = new Set(['Themba Khumalo', 'Kofi Mensah', 'Amara Balogun', 'Fatou Diop', 'Juma Kimani']);
    return conversations.filter(
      (c) =>
        !DUMMY_IDS.has(c.id) &&
        (!c.participantId || !DUMMY_PARTICIPANTS.has(c.participantId)) &&
        !DUMMY_TITLES.has(c.title)
    );
  }

  /** No-op — simulated replies are disabled; only real users communicate. */
  public scheduleSimulatedPeerReply(
    _conversation: Conversation,
    _userText: string,
    _onReply: (replyMsg: ChatMessage) => void,
    _onTypingState?: (isTyping: boolean) => void
  ) {
    // Disabled: only real authenticated users communicate on Yethu
  }
}

export const realtimeChat = new RealtimeChatService();
