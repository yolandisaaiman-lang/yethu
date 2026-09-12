'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { MessageSquare, Radio, Flame, Sparkles, Briefcase, Settings, LogOut, User, Globe, UserPlus } from 'lucide-react';

interface AppRailProps {
  activeTab: 'chats' | 'stories' | 'ai' | 'jobs';
  setActiveTab: (tab: 'chats' | 'stories' | 'ai' | 'jobs') => void;
  totalUnread: number;
  onOpenFindContacts?: () => void;
  pendingInvitesCount?: number;
}

export default function AppRail({
  activeTab,
  setActiveTab,
  totalUnread,
  onOpenFindContacts,
  pendingInvitesCount = 0,
}: AppRailProps) {
  const { user, openGoLiveModal, openProfileModal, logout } = useAuth();

  return (
    <aside className="w-16 sm:w-18 flex flex-col items-center justify-between py-4 border-r border-white/10 bg-[#090a0c] select-none z-30 shrink-0">
      {/* Top Section: Brand & Primary Navigation */}
      <div className="flex flex-col items-center space-y-6 w-full">
        {/* Brand Icon Glyph */}
        <div className="relative group cursor-pointer" onClick={() => setActiveTab('chats')}>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl african-sunset-gradient shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <span className="text-xl font-black text-white font-mono">Y</span>
          </div>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-live-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-[#090a0c]" />
          </span>
        </div>

        {/* Navigation Rail Buttons */}
        <nav className="flex flex-col items-center space-y-3 w-full px-2">
          {/* 1. Chats Icon (Showing all chats) */}
          <button
            onClick={() => setActiveTab('chats')}
            title="All Chats"
            className={`relative flex h-11 w-11 items-center justify-center rounded-2xl transition-all ${
              activeTab === 'chats'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
            }`}
          >
            <MessageSquare className="h-5 w-5" />
            {totalUnread > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-black text-black ring-2 ring-[#090a0c]">
                {totalUnread}
              </span>
            )}
          </button>

          {/* 1b. Find Contacts Icon (Invite to Chat) */}
          {onOpenFindContacts && (
            <button
              onClick={onOpenFindContacts}
              title="Find Contacts & Invites"
              className="relative flex h-11 w-11 items-center justify-center rounded-2xl text-zinc-400 hover:text-amber-400 hover:bg-zinc-850 border border-transparent hover:border-amber-500/30 transition-all cursor-pointer"
            >
              <UserPlus className="h-5 w-5" />
              {pendingInvitesCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-black text-black ring-2 ring-[#090a0c] animate-pulse">
                  {pendingInvitesCount}
                </span>
              )}
            </button>
          )}

          {/* 2. Go Live Icon (Underneath chat icon as requested) */}
          <button
            onClick={openGoLiveModal}
            title="Go Live (120s Session)"
            className="group relative flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-600/20 text-rose-400 border border-rose-500/40 hover:bg-rose-600 hover:text-white transition-all shadow-md shadow-rose-600/20 active:scale-95"
          >
            <Radio className="h-5 w-5 group-hover:animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
            </span>
          </button>

          {/* 3. 48-Hour Vault / Moments */}
          <button
            onClick={() => setActiveTab('stories')}
            title="48-Hour Ephemeral Moments"
            className={`relative flex h-11 w-11 items-center justify-center rounded-2xl transition-all ${
              activeTab === 'stories'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
            }`}
          >
            <Flame className="h-5 w-5" />
          </button>

          {/* 4. Yethu AI Translation Matrix */}
          <button
            onClick={() => setActiveTab('ai')}
            title="Yethu AI Language Engine"
            className={`relative flex h-11 w-11 items-center justify-center rounded-2xl transition-all ${
              activeTab === 'ai'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
            }`}
          >
            <Sparkles className="h-5 w-5" />
          </button>

          {/* 5. Yethu Jobs AI Hunting Agent (Underneath Yethu AI as requested) */}
          <button
            onClick={() => setActiveTab('jobs')}
            title="Yethu Jobs — 100% Match AI Hunting Agent & Browserbase Auto-Apply"
            className={`relative flex h-11 w-11 items-center justify-center rounded-2xl transition-all group ${
              activeTab === 'jobs'
                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30 shadow-md shadow-orange-500/10'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
            }`}
          >
            <Briefcase className="h-5 w-5 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400 border border-[#090a0c]" />
            </span>
          </button>
        </nav>
      </div>

      {/* Bottom Section: Profile, Settings, Sign Out */}
      <div className="flex flex-col items-center space-y-3 w-full px-2">
        {/* Profile Avatar / Trigger for Profile Editor */}
        <button
          onClick={openProfileModal}
          title={`Edit Profile (${user?.country || 'Set Country'})`}
          className="relative flex h-11 w-11 items-center justify-center rounded-2xl overflow-hidden border-2 border-amber-500/40 hover:border-amber-400 hover:scale-105 transition-all"
        >
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full african-sunset-gradient flex items-center justify-center text-sm font-black text-white">
              {user?.name?.charAt(0) || 'U'}
            </div>
          )}
          {user?.countryCode && (
            <span className="absolute bottom-0 right-0 text-[10px] bg-black/80 rounded-tl px-1">
              {user.countryCode === 'ZA' ? '🇿🇦' : user.countryCode === 'NG' ? '🇳🇬' : user.countryCode === 'KE' ? '🇰🇪' : user.countryCode === 'GH' ? '🇬🇭' : '🌍'}
            </span>
          )}
        </button>

        {/* Quick Settings / Profile modal shortcut */}
        <button
          onClick={openProfileModal}
          title="Account Settings & InsForge Sync"
          className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-850 transition-colors"
        >
          <Settings className="h-4 w-4" />
        </button>

        {/* Sign Out Button (Prominent & Clear) */}
        <button
          onClick={logout}
          title="Sign Out to Landing Page"
          className="group flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/20 hover:border-rose-500 transition-all cursor-pointer"
        >
          <LogOut className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
        </button>
      </div>
    </aside>
  );
}
