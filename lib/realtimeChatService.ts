'use client';

import { insforge } from './insforge';
import { ChatMessage, Conversation } from './chatData';
import { encryptOneOnOneMessage, decryptOneOnOneMessage, isEncryptedMessage } from './crypto';

const LOCAL_STORAGE_CHATS_KEY = 'yethu_conversations_v1';
const BROADCAST_CHANNEL_NAME = 'yethu_realtime_chats';

export type RealtimeChatEvent =
  | { type: 'NEW_MESSAGE'; conversationId: string; message: ChatMessage }
  | { type: 'TYPING'; conversationId: string; userId: string; userName: string; isTyping: boolean }
  | { type: 'CONVERSATION_UPDATED'; conversation: Conversation };

class RealtimeChatService {
  private channel: BroadcastChannel | null = null;
  private listeners: Set<(event: RealtimeChatEvent) => void> = new Set();
  private isInsForgeConnected: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        this.channel.onmessage = (e) => {
          if (e.data) {
            this.notifyListeners(e.data as RealtimeChatEvent);
          }
        };
      } catch (err) {
        console.warn('BroadcastChannel not supported in this environment', err);
      }

      this.initInsForgeRealtime();
    }
  }

  private async initInsForgeRealtime() {
    try {
      if (insforge && insforge.realtime) {
        await insforge.realtime.connect();
        this.isInsForgeConnected = true;

        insforge.realtime.on('yethu:chat:event', (msg: any) => {
          if (msg && msg.payload) {
            this.notifyListeners(msg.payload as RealtimeChatEvent);
          }
        });
      }
    } catch (e) {
      console.info('InsForge Realtime active with local peer bridge:', e);
    }
  }

  public subscribe(callback: (event: RealtimeChatEvent) => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifyListeners(event: RealtimeChatEvent) {
    this.listeners.forEach((cb) => {
      try {
        cb(event);
      } catch (e) {
        console.error('Error executing realtime listener:', e);
      }
    });
  }

  /**
   * Broadcast an event across all browser tabs, local state, and InsForge Realtime.
   */
  public async broadcast(event: RealtimeChatEvent): Promise<void> {
    // 1. Notify current tab listeners
    this.notifyListeners(event);

    // 2. Multi-tab broadcast via BroadcastChannel
    if (this.channel) {
      try {
        this.channel.postMessage(event);
      } catch (e) {
        console.warn('Could not post to BroadcastChannel', e);
      }
    }

    // 3. Publish to InsForge Realtime websocket if connected
    if (this.isInsForgeConnected && insforge && insforge.realtime) {
      try {
        await insforge.realtime.publish('yethu_public_chats', 'yethu:chat:event', event);
      } catch (err) {
        // Safe fallback
      }
    }
  }

  /**
   * Loads saved conversations from localStorage or falls back to initialConversations.
   * Automatically purges legacy dummy user accounts.
   */
  public loadStoredConversations(fallback: Conversation[]): Conversation[] {
    if (typeof window === 'undefined') return fallback;
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_CHATS_KEY);
      if (stored) {
        const parsed: Conversation[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const DUMMY_CONV_IDS = new Set(['conv_themba_direct', 'conv_kofi_direct', 'conv_amara_direct']);
          const DUMMY_PARTICIPANTS = new Set(['themba', 'kofi', 'amara', 'fatou', 'juma', 'zola', 'aline', 'u_themba', 'u_kofi', 'u_amara']);
          const DUMMY_TITLES = new Set(['Themba Khumalo', 'Kofi Mensah', 'Amara Balogun', 'Fatou Diop', 'Juma Kimani']);

          const cleaned = parsed.filter(
            (c) =>
              !DUMMY_CONV_IDS.has(c.id) &&
              (!c.participantId || !DUMMY_PARTICIPANTS.has(c.participantId)) &&
              !DUMMY_TITLES.has(c.title)
          );

          if (cleaned.length !== parsed.length) {
            localStorage.setItem(LOCAL_STORAGE_CHATS_KEY, JSON.stringify(cleaned));
          }
          return cleaned.length > 0 ? cleaned : fallback;
        }
      }
    } catch (e) {
      console.warn('Could not parse stored conversations:', e);
    }
    return fallback;
  }

  /**
   * Persists conversations to localStorage.
   */
  public saveConversations(conversations: Conversation[]): void {
    if (typeof window === 'undefined') return;
    try {
      const DUMMY_CONV_IDS = new Set(['conv_themba_direct', 'conv_kofi_direct', 'conv_amara_direct']);
      const DUMMY_PARTICIPANTS = new Set(['themba', 'kofi', 'amara', 'fatou', 'juma', 'zola', 'aline', 'u_themba', 'u_kofi', 'u_amara']);
      const DUMMY_TITLES = new Set(['Themba Khumalo', 'Kofi Mensah', 'Amara Balogun', 'Fatou Diop', 'Juma Kimani']);

      const cleaned = conversations.filter(
        (c) =>
          !DUMMY_CONV_IDS.has(c.id) &&
          (!c.participantId || !DUMMY_PARTICIPANTS.has(c.participantId)) &&
          !DUMMY_TITLES.has(c.title)
      );

      localStorage.setItem(LOCAL_STORAGE_CHATS_KEY, JSON.stringify(cleaned));
    } catch (e) {
      console.warn('Could not persist conversations to localStorage:', e);
    }
  }

  /**
   * Real user messaging handler (simulation deprecated).
   */
  public scheduleSimulatedPeerReply(
    _conversation: Conversation,
    _userText: string,
    _onReply: (replyMsg: ChatMessage) => void,
    _onTypingState?: (isTyping: boolean) => void
  ) {
    // Disabled: Only real authenticated users communicate on Yethu
  }
}

export const realtimeChat = new RealtimeChatService();
