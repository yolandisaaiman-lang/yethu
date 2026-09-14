'use client';

import React, { useState, useEffect } from 'react';
import { Conversation, StoryItem } from '@/lib/chatData';
import { contactInviteService, DiscoverableContact } from '@/lib/contactInviteService';
import {
  Search,
  Radio,
  Plus,
  Flame,
  Lock,
  MessageSquarePlus,
  UserPlus,
  Loader2,
  X,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface ChatListPaneProps {
  conversations: Conversation[];
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
  stories: StoryItem[];
  onSelectStory?: (story: StoryItem) => void;
  onStartNewChat?: () => void;
  onOpenFindContacts?: () => void;
  onStartDirectChat?: (contact: {
    id: string;
    name: string;
    handle: string;
    avatar: string;
    countryFlag: string;
    countryName: string;
    language: string;
  }) => void;
  pendingInvitesCount?: number;
}

export default function ChatListPane({
  conversations,
  activeConversationId,
  onSelectConversation,
  stories,
  onSelectStory,
  onStartNewChat,
  onOpenFindContacts,
  onStartDirectChat,
  pendingInvitesCount = 0,
}: ChatListPaneProps) {
  const { openGoLiveModal, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'unread' | 'groups' | 'direct' | 'live'>('all');
  const [searchedUsers, setSearchedUsers] = useState<DiscoverableContact[]>([]);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);

  // Debounced real-time user search from InsForge database & local registry
  useEffect(() => {
    const clean = searchQuery.trim();
    if (!clean) {
      setSearchedUsers([]);
      setIsSearchingUsers(false);
      return;
    }

    setIsSearchingUsers(true);
    const timer = setTimeout(async () => {
      try {
        const users = await contactInviteService.searchContacts(clean, user?.id, user?.email);
        setSearchedUsers(users);
      } catch (err) {
        console.warn('Real-time contact search error:', err);
      } finally {
        setIsSearchingUsers(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [searchQuery, user?.id, user?.email]);

  const filteredConversations = conversations.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessageSnippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.countryName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterMode === 'unread') return c.unreadCount > 0;
    if (filterMode === 'groups') return c.isGroup;
    if (filterMode === 'direct') return !c.isGroup;
    if (filterMode === 'live') return c.isLiveNow;
    return true;
  });

  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="w-full md:w-80 lg:w-96 flex flex-col border-r border-white/10 bg-[#0d0f12] select-none h-full shrink-0">
      {/* Header */}
      <div className="p-4 pb-2 border-b border-white/5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-white font-mono tracking-tight">Chats</h1>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
              YETHU AI
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {onOpenFindContacts && (
              <button
                onClick={onOpenFindContacts}
                title="Discover Real Users & Invite"
                className="relative flex items-center gap-1 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 px-2.5 py-1 text-xs font-bold transition-all active:scale-95 cursor-pointer"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Find</span>
                {pendingInvitesCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-black text-black">
                    {pendingInvitesCount}
                  </span>
                )}
              </button>
            )}

            {onStartNewChat && (
              <button
                onClick={onStartNewChat}
                title="Start 1-on-1 Encrypted Chat"
                className="flex items-center gap-1 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 px-2.5 py-1 text-xs font-bold transition-all active:scale-95 cursor-pointer"
              >
                <MessageSquarePlus className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">1-on-1</span>
              </button>
            )}

            <button
              onClick={openGoLiveModal}
              title="Start 120s Live Broadcast"
              className="flex items-center gap-1 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 px-2.5 py-1 text-xs font-bold transition-all"
            >
              <Radio className="h-3 w-3 animate-pulse" />
              <span>Go Live</span>
            </button>
          </div>
        </div>

        {/* Search Bar with Real-time indicator */}
        <div className="relative">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search channels or real authenticated users..."
            className="w-full rounded-xl bg-zinc-900/90 border border-white/10 pl-10 pr-9 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400/60"
          />
          {isSearchingUsers ? (
            <Loader2 className="absolute right-3 top-2.5 h-4 w-4 text-amber-400 animate-spin" />
          ) : searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-zinc-500 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        {/* Filter Pills (WhatsApp Style) */}
        {!isSearching && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            {(['all', 'direct', 'groups', 'unread', 'live'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterMode(filter)}
                className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-all shrink-0 capitalize ${
                  filterMode === filter
                    ? 'bg-amber-500 text-black font-bold shadow-sm shadow-amber-500/20'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {filter === 'live' ? '🔴 Live Now' : filter === 'direct' ? '🔒 1-on-1' : filter}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 48-Hour Ephemeral Stories Strip (Vault Moments) */}
      {!isSearching && (
        <div className="px-4 py-3 border-b border-white/5 bg-zinc-950/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
              <Flame className="h-3 w-3 text-orange-400" />
              48-Hour Vault Moments
            </span>
            <span className="text-[10px] text-amber-400/80 font-mono">Self-Destructing</span>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
            {stories.map((story, i) => (
              <div
                key={story.id}
                onClick={() => {
                  if (i === 0) {
                    openGoLiveModal();
                  } else if (onSelectStory) {
                    onSelectStory(story);
                  }
                }}
                className="flex flex-col items-center shrink-0 cursor-pointer group"
              >
                <div className="relative">
                  {i === 0 ? (
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 border-2 border-dashed border-amber-500/60 group-hover:border-amber-400 transition-colors"
                      title="Add your 48h moment or live stream"
                    >
                      <Plus className="h-5 w-5 text-amber-400" />
                    </div>
                  ) : (
                    <div className={`p-0.5 rounded-full ${story.hasUnseen ? 'african-sunset-gradient' : 'border border-zinc-700'}`}>
                      <img
                        src={story.creatorAvatar}
                        alt={story.creatorName}
                        className="h-11 w-11 rounded-full object-cover border border-[#090a0c]"
                      />
                    </div>
                  )}
                  {story.countryFlag && story.countryFlag !== '➕' && (
                    <span className="absolute bottom-0 right-0 text-[10px]">
                      {story.countryFlag}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium text-zinc-300 mt-1 max-w-[64px] truncate text-center">
                  {story.creatorName}
                </span>
                <span className="text-[9px] text-zinc-500 font-mono">
                  {story.timeRemaining}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Conversation & User Search List */}
      <div className="flex-1 overflow-y-auto divide-y divide-white/5">
        {/* Real-time Search Mode */}
        {isSearching ? (
          <div className="space-y-3 p-2">
            {/* Real Authenticated Users Found in Database */}
            {searchedUsers.length > 0 && (
              <div className="space-y-1.5">
                <div className="px-2 pt-1 flex items-center justify-between text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <UserCheck className="h-3 w-3 text-emerald-400" />
                    Verified Users ({searchedUsers.length})
                  </span>
                  <span className="text-zinc-500 font-mono text-[9px]">InsForge Auth</span>
                </div>

                <div className="space-y-1">
                  {searchedUsers.map((u) => (
                    <div
                      key={u.id}
                      onClick={() => {
                        if (onStartDirectChat) {
                          onStartDirectChat({
                            id: u.id,
                            name: u.name,
                            handle: u.handle,
                            avatar: u.avatar,
                            countryFlag: u.countryFlag,
                            countryName: u.country,
                            language: u.language,
                          });
                          setSearchQuery('');
                        }
                      }}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/90 border border-white/5 hover:border-emerald-500/40 cursor-pointer transition-all group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative shrink-0">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="h-10 w-10 rounded-full object-cover border border-white/10"
                          />
                          <span className="absolute bottom-0 right-0 text-[10px]">{u.countryFlag}</span>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-white truncate">{u.name}</span>
                            <span className="text-[11px] text-zinc-400 font-mono truncate">{u.handle}</span>
                          </div>
                          <p className="text-[10px] text-zinc-500 truncate">{u.language} • {u.country}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="shrink-0 flex items-center gap-1 text-[11px] font-bold bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/30 border border-emerald-500/40 px-2.5 py-1.5 rounded-lg transition-all"
                      >
                        <Lock className="h-3 w-3" />
                        <span>Chat</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Matched Channel Conversations */}
            {filteredConversations.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <div className="px-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Channels &amp; Hubs ({filteredConversations.length})
                </div>
                {filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => {
                      onSelectConversation(conv.id);
                      setSearchQuery('');
                    }}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-zinc-900/60 cursor-pointer transition-all border border-transparent hover:border-white/5"
                  >
                    <div className="relative shrink-0">
                      <img
                        src={conv.avatar}
                        alt={conv.title}
                        className="h-9 w-9 rounded-full object-cover border border-white/10"
                      />
                      <span className="absolute bottom-0 right-0 text-[9px]">{conv.countryFlag}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{conv.title}</h4>
                      <p className="text-[10px] text-zinc-400 truncate">{conv.lastMessageSnippet}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State when no users or channels match */}
            {searchedUsers.length === 0 && filteredConversations.length === 0 && !isSearchingUsers && (
              <div className="p-8 text-center text-xs space-y-3">
                <p className="text-zinc-400">
                  No users or channels found for &quot;<span className="text-amber-400 font-semibold">{searchQuery}</span>&quot;
                </p>
                <p className="text-[11px] text-zinc-500 max-w-xs mx-auto">
                  Try searching by their real name (e.g. Neil, Warren) or email handle.
                </p>
                {onOpenFindContacts && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      onOpenFindContacts();
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl african-sunset-gradient px-4 py-2 text-xs font-bold text-white shadow"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    <span>Open User Discovery</span>
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Normal Conversation List */
          filteredConversations.length === 0 ? (
            filterMode === 'direct' ? (
              <div className="p-8 text-center text-xs space-y-3">
                <div className="flex h-10 w-10 mx-auto items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Lock className="h-5 w-5" />
                </div>
                <p className="font-semibold text-zinc-300">No 1-on-1 Chats Yet</p>
                <p className="text-[11px] text-zinc-500 max-w-xs mx-auto">
                  Search for any registered user in the search bar above to start an encrypted direct conversation.
                </p>
                {onOpenFindContacts && (
                  <button
                    onClick={onOpenFindContacts}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 px-3.5 py-1.5 text-xs font-bold transition-all"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    <span>Find Real Users</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-zinc-500 text-xs">
                No chats matching your filter.
              </div>
            )
          ) : (
            filteredConversations.map((conv) => {
              const isActive = conv.id === activeConversationId;
              return (
                <div
                  key={conv.id}
                  onClick={() => onSelectConversation(conv.id)}
                  className={`flex items-start gap-3 p-3.5 cursor-pointer transition-all ${
                    isActive
                      ? 'bg-zinc-800/80 border-l-4 border-amber-500'
                      : 'hover:bg-zinc-900/50'
                  }`}
                >
                  {/* Avatar with Live Indicator */}
                  <div className="relative shrink-0">
                    <img
                      src={conv.avatar}
                      alt={conv.title}
                      className="h-12 w-12 rounded-full object-cover border border-white/10"
                    />
                    {conv.isLiveNow && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 border-2 border-[#0d0f12] text-[8px] font-bold text-white items-center justify-center">
                          🔴
                        </span>
                      </span>
                    )}
                    <span className="absolute bottom-0 right-0 text-xs">{conv.countryFlag}</span>
                  </div>

                  {/* Conversation Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h3 className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                        <span>{conv.title}</span>
                        {conv.isEncrypted && (
                          <span title="End-to-End Encrypted" className="inline-flex">
                            <Lock className="h-3 w-3 text-emerald-400 shrink-0" />
                          </span>
                        )}
                      </h3>
                      <span className="text-[10px] text-zinc-500 shrink-0 font-mono">
                        {conv.lastMessageTime}
                      </span>
                    </div>

                    <p className="text-[11px] text-zinc-400 truncate flex items-center gap-1">
                      <span className="text-emerald-400 font-mono text-[10px]">
                        [AI]
                      </span>
                      <span>{conv.lastMessageSnippet}</span>
                    </p>

                    <div className="flex items-center justify-between mt-1 text-[10px]">
                      <span className="text-zinc-500 truncate">{conv.primaryLanguage}</span>
                      {conv.unreadCount > 0 && (
                        <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-black text-black">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )
        )}
      </div>
    </div>
  );
}
