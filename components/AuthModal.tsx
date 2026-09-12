'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { AFRICAN_LANGUAGES } from '@/lib/languages';
import { AFRICAN_COUNTRIES } from '@/lib/countries';
import { X, Lock, Mail, User, Globe, ArrowRight, Sparkles, CheckCircle2, ShieldAlert, MapPin } from 'lucide-react';

export default function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalTab,
    openAuthModal,
    login,
    signup,
    loginDemo,
  } = useAuth();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [nativeLanguage, setNativeLanguage] = useState('isiXhosa');
  const [targetLanguage, setTargetLanguage] = useState('Kiswahili');
  const [country, setCountry] = useState('South Africa');
  const [countryCode, setCountryCode] = useState('ZA');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    if (authModalTab === 'signin') {
      const res = await login(email, password);
      setIsSubmitting(false);
      if (!res.success) {
        setErrorMsg(res.error || 'Failed to sign in. Please verify your credentials.');
      }
    } else {
      if (!name.trim() || !handle.trim()) {
        setErrorMsg('Please provide your name and username handle.');
        setIsSubmitting(false);
        return;
      }
      const res = await signup({
        email,
        password,
        name,
        handle,
        nativeLanguage,
        targetLanguage,
        country,
        countryCode,
      });
      setIsSubmitting(false);
      if (!res.success) {
        setErrorMsg(res.error || 'Could not complete registration.');
      } else {
        // Flag that new user signed up so FindContactsModal auto-triggers
        try {
          localStorage.setItem('yethu_just_signed_up', 'true');
        } catch (e) {
          // safe
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      {/* Outer Card Container */}
      <div className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-zinc-950 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl text-white">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 rounded-full p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
          title="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Brand Banner */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl african-sunset-gradient shadow-md shadow-orange-500/30">
            <span className="font-black text-white font-mono text-lg">Y</span>
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tight text-white font-mono">
              YETHU AUTH
            </h3>
            <p className="text-xs text-zinc-400">
              Africa. Live. Connected. (InsForge BaaS)
            </p>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 rounded-2xl bg-zinc-900 p-1 mb-6 border border-white/10 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setErrorMsg(null);
              openAuthModal('signin');
            }}
            className={`rounded-xl py-2.5 transition-all ${
              authModalTab === 'signin'
                ? 'bg-zinc-800 text-amber-400 shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setErrorMsg(null);
              openAuthModal('signup');
            }}
            className={`rounded-xl py-2.5 transition-all ${
              authModalTab === 'signup'
                ? 'african-sunset-gradient text-white shadow-md shadow-orange-500/20'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/15 p-3 text-xs text-rose-300 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {authModalTab === 'signup' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Full Name */}
                <div>
                  <label className="block text-[11px] font-bold text-zinc-300 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Nandi Mthembu"
                      className="w-full rounded-xl bg-zinc-900 border border-white/10 pl-10 pr-3 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Handle */}
                <div>
                  <label className="block text-[11px] font-bold text-zinc-300 mb-1">
                    Username / Handle
                  </label>
                  <input
                    type="text"
                    required
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    placeholder="@nandi_live"
                    className="w-full rounded-xl bg-zinc-900 border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Country Selection */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-300 mb-1 flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-amber-400" />
                  Country
                </label>
                <select
                  value={country}
                  onChange={(e) => {
                    const found = AFRICAN_COUNTRIES.find((c) => c.name === e.target.value);
                    if (found) {
                      setCountry(found.name);
                      setCountryCode(found.code);
                    }
                  }}
                  className="w-full rounded-xl bg-zinc-900 border border-white/10 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  {AFRICAN_COUNTRIES.map((c) => (
                    <option key={c.code} value={c.name}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Language Preferences */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-2xl bg-zinc-900/50 border border-white/5">
                <div>
                  <label className="block text-[10px] font-bold text-amber-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    My Language
                  </label>
                  <select
                    value={nativeLanguage}
                    onChange={(e) => setNativeLanguage(e.target.value)}
                    className="w-full rounded-lg bg-zinc-900 border border-white/10 px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    {AFRICAN_LANGUAGES.map((l) => (
                      <option key={l.code} value={l.name}>
                        {l.flag} {l.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-emerald-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Translate Incoming To
                  </label>
                  <select
                    value={targetLanguage}
                    onChange={(e) => setTargetLanguage(e.target.value)}
                    className="w-full rounded-lg bg-zinc-900 border border-white/10 px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    {AFRICAN_LANGUAGES.map((l) => (
                      <option key={l.code} value={l.name}>
                        {l.flag} {l.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <label className="block text-[11px] font-bold text-zinc-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.africa"
                className="w-full rounded-xl bg-zinc-900 border border-white/10 pl-10 pr-3 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-[11px] font-bold text-zinc-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl bg-zinc-900 border border-white/10 pl-10 pr-3 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* 48h Ephemeral Pledge */}
          {authModalTab === 'signup' && (
            <div className="flex items-start gap-2 pt-1 text-[11px] text-zinc-400">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
              <span>
                I understand that on Yethu, all video moments and live replays automatically expire and self-destruct after 48 hours.
              </span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 rounded-xl african-sunset-gradient py-3 text-xs font-bold text-white shadow-lg shadow-orange-500/25 hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all mt-2"
          >
            {isSubmitting ? (
              <span>Connecting to InsForge...</span>
            ) : authModalTab === 'signin' ? (
              <>
                <span>Sign In to Yethu</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            ) : (
              <>
                <span>Create African Account</span>
                <Sparkles className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </form>

        {/* One-Click Demo Profiles for Friction-Free Testing */}
        <div className="mt-6 pt-5 border-t border-white/10">
          <p className="text-[11px] font-semibold text-zinc-400 text-center mb-3">
            Or test instantly with pre-loaded profiles:
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => loginDemo('nandi')}
              className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-zinc-900 p-2.5 text-left hover:border-amber-500/40 hover:bg-zinc-850 transition-all group"
            >
              <span className="text-xl">🇿🇦</span>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                  Nandi (Creator)
                </p>
                <p className="text-[10px] text-zinc-500 truncate">isiZulu ➔ Kiswahili</p>
              </div>
            </button>

            <button
              onClick={() => loginDemo('kofi')}
              className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-zinc-900 p-2.5 text-left hover:border-amber-500/40 hover:bg-zinc-850 transition-all group"
            >
              <span className="text-xl">🇬🇭</span>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                  Kofi (Streamer)
                </p>
                <p className="text-[10px] text-zinc-500 truncate">English ➔ isiXhosa</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
