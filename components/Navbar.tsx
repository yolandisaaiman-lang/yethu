'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { AFRICAN_LANGUAGES } from '@/lib/languages';
import { Radio, Globe, User, LogOut, Sparkles, ChevronDown, Flame } from 'lucide-react';

export default function Navbar() {
  const { user, openAuthModal, logout, updateUserLanguages } = useAuth();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const currentNativeLang = AFRICAN_LANGUAGES.find(
    (l) => l.name === user?.nativeLanguage || l.name === 'isiXhosa'
  ) || AFRICAN_LANGUAGES[0];

  const currentTargetLang = AFRICAN_LANGUAGES.find(
    (l) => l.name === user?.targetLanguage || l.name === 'Kiswahili'
  ) || AFRICAN_LANGUAGES[2];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#090a0c]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl african-sunset-gradient shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <span className="text-xl font-black tracking-tighter text-white">Y</span>
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-live-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-[#090a0c]"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-white font-mono">
                  YETHU
                </span>
                <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                  Live
                </span>
              </div>
              <p className="text-[11px] font-medium text-zinc-400 tracking-wide">
                Africa. Live. Connected.
              </p>
            </div>
          </a>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300">
          <a href="#ephemeral-feed" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
            <Flame className="h-4 w-4 text-amber-500" />
            48h Vault
          </a>
          <a href="#ai-translator" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            Yethu AI
          </a>
        </nav>

        {/* Actions & Language Selector */}
        <div className="flex items-center gap-3">
          {/* Quick Language Matrix Display */}
          <div className="relative">
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900/80 px-3 py-1.5 text-xs text-zinc-200 hover:border-amber-500/40 hover:bg-zinc-800 transition-all"
              title="Change your translation pairing"
            >
              <Globe className="h-3.5 w-3.5 text-amber-400" />
              <span className="font-semibold">{currentNativeLang.flag} {currentNativeLang.name}</span>
              <span className="text-zinc-500">⇄</span>
              <span className="font-semibold text-zinc-400">{currentTargetLang.flag} {currentTargetLang.name}</span>
              <ChevronDown className="h-3 w-3 text-zinc-400" />
            </button>

            {isLangMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-white/15 bg-zinc-950 p-4 shadow-2xl backdrop-blur-2xl z-50">
                <div className="mb-2">
                  <p className="text-xs font-semibold text-white">Select Your Native Tongue</p>
                  <p className="text-[11px] text-zinc-400">Incoming feeds auto-translate to your choice</p>
                </div>
                <div className="max-h-56 space-y-1 overflow-y-auto py-1 pr-1">
                  {AFRICAN_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        updateUserLanguages(lang.name, currentTargetLang.name);
                        setIsLangMenuOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs transition-colors ${
                        currentNativeLang.code === lang.code
                          ? 'bg-amber-500/20 text-amber-400 font-semibold border border-amber-500/30'
                          : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                        <span className="text-[10px] text-zinc-500">({lang.nativeName})</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Auth Section */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 rounded-full border border-amber-500/40 bg-zinc-900 px-3 py-1.5 text-xs text-white hover:bg-zinc-800 transition-all"
              >
                <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-[11px] font-bold">
                  {user.name.charAt(0)}
                </div>
                <span className="font-semibold hidden sm:inline">{user.handle}</span>
                <ChevronDown className="h-3 w-3 text-zinc-400" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-white/10 bg-zinc-950 p-2 shadow-2xl z-50">
                  <div className="px-3 py-2 border-b border-white/10">
                    <p className="text-xs font-bold text-white">{user.name}</p>
                    <p className="text-[11px] text-zinc-400">{user.email}</p>
                    <div className="mt-1 flex items-center gap-1.5 text-[10px] text-amber-400">
                      <span>Speaking: {user.nativeLanguage}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                    }}
                    className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openAuthModal('signin')}
                className="rounded-full px-3.5 py-1.5 text-xs font-semibold text-zinc-200 hover:text-white transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => openAuthModal('signup')}
                className="rounded-full african-sunset-gradient px-4 py-1.5 text-xs font-bold text-white shadow-md shadow-orange-500/20 hover:brightness-110 active:scale-95 transition-all"
              >
                Join Yethu
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
