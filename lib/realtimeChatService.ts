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
   */
  public loadStoredConversations(fallback: Conversation[]): Conversation[] {
    if (typeof window === 'undefined') return fallback;
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_CHATS_KEY);
      if (stored) {
        const parsed: Conversation[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
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
      localStorage.setItem(LOCAL_STORAGE_CHATS_KEY, JSON.stringify(conversations));
    } catch (e) {
      console.warn('Could not persist conversations to localStorage:', e);
    }
  }

  /**
   * Simulates an intelligent, encrypted African peer reply for 1-on-1 chats.
   */
  public scheduleSimulatedPeerReply(
    conversation: Conversation,
    userText: string,
    onReply: (replyMsg: ChatMessage) => void,
    onTypingState?: (isTyping: boolean) => void
  ) {
    if (conversation.isGroup) return; // Only for 1-on-1 private chats

    // Start typing after 1.2s
    setTimeout(() => {
      if (onTypingState) onTypingState(true);

      this.broadcast({
        type: 'TYPING',
        conversationId: conversation.id,
        userId: conversation.id,
        userName: conversation.title,
        isTyping: true,
      });

      // Reply after 2.8s
      setTimeout(async () => {
        if (onTypingState) onTypingState(false);

        this.broadcast({
          type: 'TYPING',
          conversationId: conversation.id,
          userId: conversation.id,
          userName: conversation.title,
          isTyping: false,
        });

        // Dynamic context-aware responses tailored to African languages and culture
        let original = 'Yebo mngani wami! Ngiyezwa, sizokhuluma ngokushesha.';
        let translated = 'Yes my friend! I hear you, we will speak shortly.';
        let lang = conversation.primaryLanguage;

        if (conversation.id.includes('themba')) {
          if (userText.toLowerCase().includes('live') || userText.toLowerCase().includes('stream')) {
            original = 'Kuhle kakhulu! Ngizolungisa ikhamera yami manje, asiqale i-120s live!';
            translated = 'Great! I am setting up my camera right now, let us start the 120s live stream!';
          } else {
            original = 'Ngiyakuzwa mkhaya! Le ngxoxo yethu ivikelekile ngempela (AES-256).';
            translated = 'I hear you brother! This chat of ours is truly encrypted (AES-256).';
          }
        } else if (conversation.id.includes('kofi')) {
          original = 'Medaase paaa! The Accra creative energy is high. Let us connect today!';
          translated = 'Thank you very much! The Accra creative energy is high. Let us connect today!';
          lang = 'Twi / English';
        } else if (conversation.id.includes('amara')) {
          original = 'Ẹ ṣe gan-an! Lagos is vibrating with Afrobeats right now.';
          translated = 'Thank you so much! Lagos is vibrating with Afrobeats right now.';
          lang = 'Yorùbá';
        } else if (conversation.id.includes('fatou')) {
          original = 'Jerejef! Nous sommes connectés en direct depuis Dakar.';
          translated = 'Thank you! We are connected live from Dakar.';
          lang = 'Wolof / Français';
        }

        // Encrypt the message payload with AES-GCM 256-bit
        const encryptedArmor = await encryptOneOnOneMessage(original, conversation.id);

        const replyMessage: ChatMessage = {
          id: `reply_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          senderId: `peer_${conversation.id}`,
          senderName: conversation.title,
          senderHandle: `@${conversation.title.toLowerCase().replace(/\s+/g, '_')}`,
          senderAvatar: conversation.avatar,
          countryFlag: conversation.countryFlag,
          sourceLanguage: lang,
          originalText: original,
          translatedText: translated,
          targetLanguage: 'English',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: false,
          isEncrypted: true,
          encryptedPayload: encryptedArmor,
          expiresIn: 'Expires in 48h 00m',
        };

        onReply(replyMessage);

        this.broadcast({
          type: 'NEW_MESSAGE',
          conversationId: conversation.id,
          message: replyMessage,
        });
      }, 2600);
    }, 1200);
  }
}

export const realtimeChat = new RealtimeChatService();
