'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { INITIAL_CONVERSATIONS, INITIAL_STORIES, Conversation, ChatMessage, StoryItem } from '@/lib/chatData';
import { realtimeChat } from '@/lib/realtimeChatService';
import { encryptOneOnOneMessage } from '@/lib/crypto';
import AppRail from './AppRail';
import ChatListPane from './ChatListPane';
import ActiveChatPane from './ActiveChatPane';
import GoLiveStudioModal from './GoLiveStudioModal';
import LiveKitWatchModal from './LiveKitWatchModal';
import ProfileModal from './ProfileModal';
import StoryViewerModal from './StoryViewerModal';
import YethuJobsPane from './YethuJobsPane';
import FindContactsModal from './FindContactsModal';
import InviteNotificationBanner from './InviteNotificationBanner';
import { contactInviteService, ChatInvite } from '@/lib/contactInviteService';
import { Flame, Sparkles, Clock, Globe, Plus, Play, ShieldCheck, Lock, UserPlus, X, Briefcase, Bell } from 'lucide-react';

export default function ChatDashboard() {
  const { user, openGoLiveModal } = useAuth();
  const [activeTab, setActiveTab] = useState<'chats' | 'stories' | 'ai' | 'jobs'>('chats');
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState<string>(INITIAL_CONVERSATIONS[0].id);
  const [stories, setStories] = useState<StoryItem[]>(INITIAL_STORIES);
  const [selectedStory, setSelectedStory] = useState<StoryItem | null>(null);
  const [peerTypingMap, setPeerTypingMap] = useState<Record<string, boolean>>({});
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [isFindContactsModalOpen, setIsFindContactsModalOpen] = useState(false);
  const [pendingInvites, setPendingInvites] = useState<ChatInvite[]>([]);
  const [realEncryptedContacts, setRealEncryptedContacts] = useState<any[]>([]);
  const [isLoadingEncryptedContacts, setIsLoadingEncryptedContacts] = useState(false);

  useEffect(() => {
    if (isNewChatModalOpen) {
      setIsLoadingEncryptedContacts(true);
      contactInviteService.searchContacts('', user?.id, user?.email).then((res) => {
        setRealEncryptedContacts(res);
        setIsLoadingEncryptedContacts(false);
      });
    }
  }, [isNewChatModalOpen, user?.id, user?.email]);

  // 1. Load stored conversations and stories after client mount
  useEffect(() => {
    const loadedConversations = realtimeChat.loadStoredConversations(INITIAL_CONVERSATIONS);
    setConversations(loadedConversations);

    try {
      const savedStories = localStorage.getItem('yethu_vault_stories');
      if (savedStories) {
        const parsed = JSON.parse(savedStories);
        if (Array.isArray(parsed)) {
          const DUMMY_STORY_IDS = new Set(['st_1', 'st_2', 'st_3', 'st_4']);
          const DUMMY_STORY_NAMES = new Set(['Themba', 'Zainab', 'Chidi', 'Amina', 'Themba Khumalo', 'Kofi Mensah', 'Amara Balogun']);
          const cleaned = parsed.filter(
            (s: any) => !DUMMY_STORY_IDS.has(s?.id) && !DUMMY_STORY_NAMES.has(s?.creatorName)
          );
          localStorage.setItem('yethu_vault_stories', JSON.stringify(cleaned));
          if (cleaned.length > 0) {
            setStories(cleaned);
          } else {
            setStories(INITIAL_STORIES);
          }
        }
      }
    } catch (e) {
      console.warn('Could not read saved vault stories', e);
    }
  }, []);

  // 1b. Load pending invites & check if new user signup trigger exists
  useEffect(() => {
    if (!user) return;

    const loadInvites = () => {
      const invs = contactInviteService.getPendingInvitesForUser(user.id, user.handle);
      setPendingInvites(invs);
    };
    loadInvites();

    // Check if user just signed up (flag set by AuthModal)
    try {
      const justSignedUp = localStorage.getItem('yethu_just_signed_up');
      if (justSignedUp === 'true') {
        localStorage.removeItem('yethu_just_signed_up');
        setIsFindContactsModalOpen(true);
      }
    } catch (e) {
      // safe
    }

    // Subscribe to realtime invite events
    const unsubInvites = contactInviteService.subscribe((event) => {
      if (event.type === 'INVITE_RECEIVED') {
        loadInvites();
      } else if (event.type === 'INVITE_ACCEPTED') {
        loadInvites();
        // If an invite sent by current user was accepted, add the new contact to conversation list
        if (event.invite.senderId === user.id) {
          handleDirectChatCreated({
            id: event.invite.recipientId,
            name: event.invite.recipientHandle.replace('@', ''),
            handle: event.invite.recipientHandle,
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
            countryFlag: '🌍',
            countryName: 'Pan-African',
            language: 'Multilingual',
          });
        }
      } else if (event.type === 'INVITE_REJECTED') {
        loadInvites();
      }
    });

    return () => unsubInvites();
  }, [user]);

  // 2. Persist conversations whenever they change
  useEffect(() => {
    realtimeChat.saveConversations(conversations);
  }, [conversations]);

  // 3. Subscribe to Realtime Chat events (multi-tab & InsForge Realtime)
  useEffect(() => {
    const unsubscribe = realtimeChat.subscribe((event) => {
      if (event.type === 'NEW_MESSAGE') {
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id === event.conversationId) {
              // Avoid duplicate messages
              if (c.messages.some((m) => m.id === event.message.id)) {
                return c;
              }
              return {
                ...c,
                lastMessageSnippet: event.message.originalText,
                lastMessageTime: event.message.timestamp,
                unreadCount: c.id === activeConversationId ? 0 : c.unreadCount + 1,
                messages: [...c.messages, event.message],
              };
            }
            return c;
          })
        );
      } else if (event.type === 'TYPING') {
        setPeerTypingMap((prev) => ({
          ...prev,
          [event.conversationId]: event.isTyping,
        }));
      }
    });

    return () => unsubscribe();
  }, [activeConversationId]);

  // Sync stories to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('yethu_vault_stories', JSON.stringify(stories));
    } catch (e) {
      console.warn('Could not persist vault stories', e);
    }
  }, [stories]);

  const handleSaveLiveToVault = ({
    title,
    viewersCount,
    thumbnailUrl,
  }: {
    title: string;
    viewersCount: number;
    thumbnailUrl: string | null;
  }) => {
    const userCountryFlag =
      user?.countryCode === 'ZA'
        ? '🇿🇦'
        : user?.countryCode === 'NG'
        ? '🇳🇬'
        : user?.countryCode === 'KE'
        ? '🇰🇪'
        : user?.countryCode === 'GH'
        ? '🇬🇭'
        : '🌍';

    const fallbackThumbnail =
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80';

    const newVaultStory: StoryItem = {
      id: `live_replay_${Date.now()}`,
      creatorName: user?.name ? `${user.name} (You)` : 'You (Live Replay)',
      creatorAvatar:
        user?.avatarUrl ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      countryFlag: userCountryFlag,
      timeRemaining: '48h 00m',
      previewImage: thumbnailUrl || fallbackThumbnail,
      hasUnseen: true,
      title: title || 'Live Broadcast',
      views: `${viewersCount} viewers`,
      isReplay: true,
      createdAt: new Date().toISOString(),
    };

    setStories((prev) => [prev[0], newVaultStory, ...prev.slice(1)]);
  };

  const activeConversation =
    conversations.find((c) => c.id === activeConversationId) || conversations[0];

  const totalUnread = conversations.reduce((acc, curr) => acc + curr.unreadCount, 0);

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
    );
  };

  const handleSendMessage = async (conversationId: string, text: string) => {
    if (!user) return;

    const userCountryFlag =
      user.countryCode === 'ZA'
        ? '🇿🇦'
        : user.countryCode === 'NG'
        ? '🇳🇬'
        : user.countryCode === 'KE'
        ? '🇰🇪'
        : user.countryCode === 'GH'
        ? '🇬🇭'
        : '🌍';

    const targetConv = conversations.find((c) => c.id === conversationId);
    const isEncrypted = Boolean(targetConv?.isEncrypted);

    // If 1-on-1, encrypt with AES-GCM-256
    let encryptedCiphertext: string | undefined = undefined;
    if (isEncrypted) {
      encryptedCiphertext = await encryptOneOnOneMessage(text, conversationId);
    }

    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      senderHandle: user.handle,
      senderAvatar: user.avatarUrl || '',
      countryFlag: userCountryFlag,
      sourceLanguage: user.nativeLanguage || 'isiZulu',
      originalText: text,
      translatedText: text,
      targetLanguage: activeConversation.primaryLanguage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      isEncrypted,
      encryptedPayload: encryptedCiphertext,
      expiresIn: 'Expires in 48h 00m',
    };

    // Optimistically update conversation state
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessageSnippet: text,
            lastMessageTime: newMessage.timestamp,
            messages: [...c.messages, newMessage],
          };
        }
        return c;
      })
    );

    // Broadcast in real-time across tabs & InsForge Realtime
    realtimeChat.broadcast({
      type: 'NEW_MESSAGE',
      conversationId,
      message: newMessage,
    });

    // If 1-on-1 private chat, trigger intelligent simulated peer response
    if (targetConv && !targetConv.isGroup) {
      realtimeChat.scheduleSimulatedPeerReply(
        targetConv,
        text,
        (replyMsg) => {
          setConversations((prev) =>
            prev.map((c) => {
              if (c.id === conversationId) {
                return {
                  ...c,
                  lastMessageSnippet: replyMsg.originalText,
                  lastMessageTime: replyMsg.timestamp,
                  unreadCount: c.id === activeConversationId ? 0 : c.unreadCount + 1,
                  messages: [...c.messages, replyMsg],
                };
              }
              return c;
            })
          );
        },
        (isTyping) => {
          setPeerTypingMap((prev) => ({
            ...prev,
            [conversationId]: isTyping,
          }));
        }
      );
    }
  };

  const handleStartDirectChat = (contact: {
    id: string;
    name: string;
    handle: string;
    avatar: string;
    countryFlag: string;
    countryName: string;
    language: string;
  }) => {
    const existing = conversations.find((c) => c.id === `conv_${contact.id}`);
    if (existing) {
      setActiveConversationId(existing.id);
      setIsNewChatModalOpen(false);
      return;
    }

    const newDirectConv: Conversation = {
      id: `conv_${contact.id}`,
      title: contact.name,
      avatar: contact.avatar,
      isGroup: false,
      countryFlag: contact.countryFlag,
      countryName: contact.countryName,
      unreadCount: 0,
      lastMessageSnippet: 'End-to-End Encrypted chat initialized (AES-256)',
      lastMessageTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isLiveNow: false,
      primaryLanguage: contact.language,
      isEncrypted: true,
      participantId: contact.id,
      participantHandle: contact.handle,
      messages: [
        {
          id: `init_${Date.now()}`,
          senderId: contact.id,
          senderName: contact.name,
          senderHandle: contact.handle,
          senderAvatar: contact.avatar,
          countryFlag: contact.countryFlag,
          sourceLanguage: contact.language,
          originalText: `Sawubona! This private 1-on-1 chat is secured with client-side AES-256 end-to-end encryption.`,
          translatedText: `Hello! This private 1-on-1 chat is secured with client-side AES-256 end-to-end encryption.`,
          targetLanguage: 'English',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: false,
          isEncrypted: true,
          expiresIn: 'Expires in 48h 00m',
        },
      ],
    };

    setConversations((prev) => [newDirectConv, ...prev]);
    setActiveConversationId(newDirectConv.id);
    setIsNewChatModalOpen(false);
  };

  const handleDirectChatCreated = handleStartDirectChat;

  const handleAcceptInvite = (invite: ChatInvite) => {
    contactInviteService.acceptInvite(invite.id);
    setPendingInvites((prev) => prev.filter((i) => i.id !== invite.id));

    // Initialize the new approved direct conversation
    handleStartDirectChat({
      id: invite.senderId,
      name: invite.senderName,
      handle: invite.senderHandle,
      avatar: invite.senderAvatar,
      countryFlag: invite.senderCountryFlag,
      countryName: invite.senderCountry,
      language: invite.senderLanguage,
    });
  };

  const handleRejectInvite = (invite: ChatInvite) => {
    contactInviteService.rejectInvite(invite.id);
    setPendingInvites((prev) => prev.filter((i) => i.id !== invite.id));
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#090a0c] text-white select-none">
      {/* 1. Left Vertical App Rail (WhatsApp style) */}
      <AppRail
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalUnread={totalUnread}
        onOpenFindContacts={() => setIsFindContactsModalOpen(true)}
        pendingInvitesCount={pendingInvites.length}
      />

      {/* 2. Main Content Area depending on Active Tab */}
      {activeTab === 'chats' && (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Top Real-time Invite Notification Banners (if any pending) */}
          {pendingInvites.map((invite) => (
            <InviteNotificationBanner
              key={invite.id}
              invite={invite}
              onAccept={handleAcceptInvite}
              onReject={handleRejectInvite}
            />
          ))}

          <div className="flex-1 flex h-full overflow-hidden">
            {/* Middle Pane: Chat List */}
            <ChatListPane
              conversations={conversations}
              activeConversationId={activeConversationId}
              onSelectConversation={handleSelectConversation}
              stories={stories}
              onSelectStory={(story) => setSelectedStory(story)}
              onStartNewChat={() => setIsNewChatModalOpen(true)}
              onOpenFindContacts={() => setIsFindContactsModalOpen(true)}
              onStartDirectChat={handleStartDirectChat}
              pendingInvitesCount={pendingInvites.length}
            />

            {/* Right Pane: Active Chat Conversation */}
            <ActiveChatPane
              conversation={activeConversation}
              onSendMessage={handleSendMessage}
              isPeerTyping={Boolean(peerTypingMap[activeConversation.id])}
            />
          </div>
        </div>
      )}

      {/* 3. 48-Hour Vault Tab View */}
      {activeTab === 'stories' && (
        <div className="flex-1 flex flex-col h-full bg-[#0d0f12] p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto w-full space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-2xl font-black text-white font-mono flex items-center gap-2">
                  <Flame className="h-6 w-6 text-orange-400" />
                  48-HOUR EPHEMERAL VAULT
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  All community moments and live stream replays self-destruct after 48 hours.
                </p>
              </div>

              <button
                onClick={openGoLiveModal}
                className="flex items-center gap-2 rounded-full african-sunset-gradient px-4 py-2 text-xs font-bold text-white shadow-md shadow-orange-500/25 hover:brightness-110"
              >
                <Plus className="h-4 w-4" />
                Post 48h Moment
              </button>
            </div>

            {/* Grid of 48h items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.filter((s) => s.previewImage).map((story) => (
                <div
                  key={story.id}
                  onClick={() => setSelectedStory(story)}
                  className="rounded-2xl border border-white/10 bg-zinc-900 overflow-hidden relative group aspect-[4/5] cursor-pointer"
                >
                  <img
                    src={story.previewImage}
                    alt={story.creatorName}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                  {/* Expiry Badge */}
                  <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-amber-400 border border-amber-500/30 backdrop-blur-md">
                    <Clock className="h-3 w-3" />
                    <span>Expires in {story.timeRemaining}</span>
                  </div>

                  {story.isReplay && (
                    <div className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-rose-600/90 px-2.5 py-1 text-[10px] font-bold text-white shadow">
                      <span>Live Replay</span>
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={story.creatorAvatar}
                        alt={story.creatorName}
                        className="h-8 w-8 rounded-full object-cover border border-white/20"
                      />
                      <div>
                        <p className="text-xs font-bold text-white leading-tight">{story.creatorName}</p>
                        <span className="text-[10px] text-zinc-400">{story.countryFlag} {story.views || 'Live Replay'}</span>
                      </div>
                    </div>

                    <button className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-black shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="h-4 w-4 fill-black ml-0.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Yethu AI Tab View */}
      {activeTab === 'ai' && (
        <div className="flex-1 flex flex-col h-full bg-[#0d0f12] p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto w-full space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-2xl font-black text-white font-mono flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-emerald-400" />
                YETHU AI MULTILINGUAL ENGINE
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Real-time neural translation connecting 50+ African dialects with sub-300ms latency.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-white/10 bg-zinc-900/80 p-6 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Globe className="h-4 w-4 text-amber-400" />
                  Your Active Translation Profile
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between p-3 rounded-xl bg-zinc-950 border border-white/5">
                    <span className="text-zinc-400">Mother Tongue (Outgoing):</span>
                    <span className="font-bold text-amber-400">{user?.nativeLanguage || 'isiZulu'}</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-zinc-950 border border-white/5">
                    <span className="text-zinc-400">Translate Incoming Messages To:</span>
                    <span className="font-bold text-emerald-400">{user?.targetLanguage || 'English'}</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-zinc-950 border border-white/5">
                    <span className="text-zinc-400">Current Country:</span>
                    <span className="font-bold text-white">{user?.country || 'South Africa'}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-zinc-900/80 p-6 space-y-3">
                <h3 className="text-base font-bold text-white">How It Works in Chats & Live</h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  When you type or speak in {user?.nativeLanguage || 'isiZulu'}, our OpenAI Realtime integration translates your message into the recipient’s preferred language while preserving your voice nuances.
                </p>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-mono text-emerald-400">
                    ● Zero Translation Delay Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Yethu Jobs AI Hunting Agent Tab View */}
      {activeTab === 'jobs' && <YethuJobsPane />}

      {/* 6. Go Live 120s Studio Modal */}
      <GoLiveStudioModal
        onSaveLiveToVault={handleSaveLiveToVault}
        onViewVault={() => setActiveTab('stories')}
      />

      {/* 6. LiveKit Watch 120s Streams Modal */}
      <LiveKitWatchModal />

      {/* 7. Profile Completion & InsForge Sync Modal */}
      <ProfileModal />

      {/* 8. 48-Hour Vault Story / Replay Viewer Modal */}
      <StoryViewerModal
        story={selectedStory}
        onClose={() => setSelectedStory(null)}
      />

      {/* 8b. Discover Contacts & Send Invites Modal */}
      <FindContactsModal
        isOpen={isFindContactsModalOpen}
        onClose={() => setIsFindContactsModalOpen(false)}
        onStartChat={(c) => {
          handleStartDirectChat({
            id: c.id,
            name: c.name,
            handle: c.handle,
            avatar: c.avatar,
            countryFlag: c.countryFlag,
            countryName: c.country,
            language: c.language,
          });
          setIsFindContactsModalOpen(false);
        }}
      />

      {/* 9. Start New 1-on-1 Encrypted Chat Modal */}
      {isNewChatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-emerald-500/30 bg-[#0d0f12] p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setIsNewChatModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Start 1-on-1 Encrypted Chat</h3>
                <p className="text-xs text-zinc-400">AES-GCM-256 Client-Side Protection</p>
              </div>
            </div>

            <p className="text-xs text-zinc-400">
              Select a verified member on Yethu to start a private, end-to-end encrypted conversation.
            </p>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {isLoadingEncryptedContacts ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2 text-zinc-400 text-xs">
                  <div className="h-5 w-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                  <span>Loading registered Yethu accounts...</span>
                </div>
              ) : realEncryptedContacts.length === 0 ? (
                <div className="text-center py-8 px-4 text-xs space-y-3">
                  <p className="font-semibold text-zinc-300">No other registered accounts found</p>
                  <p className="text-zinc-500 max-w-xs mx-auto">
                    Use the Discover Contacts tool to find real users and invite them to chat.
                  </p>
                  <button
                    onClick={() => {
                      setIsNewChatModalOpen(false);
                      setIsFindContactsModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl african-sunset-gradient px-4 py-2 text-xs font-bold text-white shadow"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    <span>Discover &amp; Invite Contacts</span>
                  </button>
                </div>
              ) : (
                realEncryptedContacts.map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() =>
                      handleStartDirectChat({
                        id: contact.id,
                        name: contact.name,
                        handle: contact.handle,
                        avatar: contact.avatar,
                        countryFlag: contact.countryFlag,
                        countryName: contact.country,
                        language: contact.language,
                      })
                    }
                    className="flex items-center justify-between p-3 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800/80 border border-white/5 hover:border-emerald-500/40 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={contact.avatar}
                          alt={contact.name}
                          className="h-10 w-10 rounded-full object-cover border border-white/10"
                        />
                        <span className="absolute bottom-0 right-0 text-xs">{contact.countryFlag}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white">{contact.name}</span>
                          <span className="text-[11px] text-zinc-400 font-mono">{contact.handle}</span>
                          <Lock className="h-2.5 w-2.5 text-emerald-400" />
                        </div>
                        <p className="text-[11px] text-zinc-400 line-clamp-1">{contact.bio || contact.email}</p>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      {contact.language}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
