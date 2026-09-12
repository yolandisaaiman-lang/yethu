'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { AFRICAN_COUNTRIES } from '@/lib/countries';
import { AFRICAN_LANGUAGES } from '@/lib/languages';
import { X, User, Globe, MapPin, Sparkles, CheckCircle2, ShieldCheck, Database, LogOut } from 'lucide-react';

export default function ProfileModal() {
  const { isProfileModalOpen, closeProfileModal, user, updateFullProfile, logout } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [handle, setHandle] = useState(user?.handle || '');
  const [country, setCountry] = useState(user?.country || 'South Africa');
  const [countryCode, setCountryCode] = useState(user?.countryCode || 'ZA');
  const [nativeLanguage, setNativeLanguage] = useState(user?.nativeLanguage || 'isiZulu');
  const [targetLanguage, setTargetLanguage] = useState(user?.targetLanguage || 'English (Pan-African)');
  const [bio, setBio] = useState(user?.bio || 'Afropolitan creator broadcasting live on Yethu.');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setHandle(user.handle || '');
      setCountry(user.country || 'South Africa');
      setCountryCode(user.countryCode || 'ZA');
      setNativeLanguage(user.nativeLanguage || 'isiZulu');
      setTargetLanguage(user.targetLanguage || 'English (Pan-African)');
      setBio(user.bio || 'Afropolitan creator broadcasting live on Yethu.');
    }
  }, [user]);

  if (!isProfileModalOpen) return null;

  const handleCountryChange = (cName: string) => {
    const found = AFRICAN_COUNTRIES.find((c) => c.name === cName);
    if (found) {
      setCountry(found.name);
      setCountryCode(found.code);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage(null);

    const res = await updateFullProfile({
      name,
      handle: handle.startsWith('@') ? handle : `@${handle}`,
      country,
      countryCode,
      nativeLanguage,
      targetLanguage,
      bio,
    });

    setIsSaving(false);
    if (res.success) {
      setSuccessMessage('Profile and language preferences successfully synced with InsForge BaaS!');
      setTimeout(() => {
        setSuccessMessage(null);
        closeProfileModal();
      }, 1500);
    }
  };

  const selectedCountry = AFRICAN_COUNTRIES.find((c) => c.name === country) || AFRICAN_COUNTRIES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-zinc-950 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl text-white">
        {/* Close Button */}
        <button
          onClick={closeProfileModal}
          className="absolute top-5 right-5 rounded-full p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl african-sunset-gradient shadow-md shadow-orange-500/20">
            <User className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tight text-white font-mono">
              COMPLETE PROFILE
            </h3>
            <p className="text-xs text-zinc-400 flex items-center gap-1.5">
              <Database className="h-3 w-3 text-amber-400" />
              <span>Synced directly to InsForge PostgreSQL (yeth)</span>
            </p>
          </div>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/15 p-3 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          {/* Name & Handle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-zinc-300 mb-1">
                Display Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nandi Mthembu"
                className="w-full rounded-xl bg-zinc-900 border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-300 mb-1">
                Username / Handle
              </label>
              <input
                type="text"
                required
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="@nandi_m"
                className="w-full rounded-xl bg-zinc-900 border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Country Selection */}
          <div>
            <label className="block text-[11px] font-bold text-zinc-300 mb-1 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-amber-400" />
              Country (African Continent)
            </label>
            <div className="relative">
              <select
                value={country}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full rounded-xl bg-zinc-900 border border-white/10 pl-3.5 pr-10 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                {AFRICAN_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.name}>
                    {c.flag} {c.name} ({c.primaryLanguage})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Languages Setup */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-zinc-900/60 border border-white/5">
            <div>
              <label className="block text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Globe className="h-3 w-3" />
                My Speaking Language
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
              <label className="block text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1">
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

          {/* Bio */}
          <div>
            <label className="block text-[11px] font-bold text-zinc-300 mb-1">
              Short Bio (48h Temporary Network)
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="What do you share on Yethu?"
              className="w-full rounded-xl bg-zinc-900 border border-white/10 px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Submit & Sign Out Actions */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <button
              type="button"
              onClick={async () => {
                closeProfileModal();
                await logout();
              }}
              className="flex items-center gap-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 px-4 py-2 text-xs font-bold text-rose-400 hover:text-rose-300 transition-all cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 rounded-xl african-sunset-gradient px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-500/25 hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isSaving ? 'Saving to InsForge...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
