'use client';

import React, { useState } from 'react';
import { Conversation, StoryItem } from '@/lib/chatData';
import { Search, Radio, Plus, Filter, Flame, Clock, Users, CheckCheck, Lock, MessageSquarePlus, ShieldCheck, UserPlus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface ChatListPaneProps {
  conversations: Conversation[];
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
  stories: StoryItem[];
  onSelectStory?: (story: StoryItem) => void;
  onStartNewChat?: () => void;
  onOpenFindContacts?: () => void;
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
  pendingInvitesCount = 0,
}: ChatListPaneProps) {
  const { openGoLiveModal, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'unread' | 'groups' | 'direct' | 'live'>('all');

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
                title="Discover Contacts & Invite to Chat"
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
                className="flex items-center gap-1 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 px-2.5 py-1 text-xs font-bold transition-all active:scale-95"
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

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search channels, encrypted contacts, languages..."
            className="w-full rounded-xl bg-zinc-900/90 border border-white/10 pl-10 pr-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400/60"
          />
        </div>

        {/* Filter Pills (WhatsApp Style) */}
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
      </div>

      {/* 48-Hour Ephemeral Stories Strip */}
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
              <span className="text-[10px] font-medium text-zinc-300 mt-1 max-w-[56px] truncate">
                {story.creatorName}
              </span>
              <span className="text-[9px] text-zinc-500 font-mono">
                {story.timeRemaining}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto divide-y divide-white/5">
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 text-xs">
            No chats matching your filter.
          </div>
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
        )}
      </div>
    </div>
  );
}
