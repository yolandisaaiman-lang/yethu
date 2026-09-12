'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Radio, Flame, Sparkles, Volume2, Globe, Heart, Send, Clock, ShieldCheck } from 'lucide-react';

interface SimulatedComment {
  id: string;
  user: string;
  avatar: string;
  originFlag: string;
  sourceLang: string;
  targetLang: string;
  originalText: string;
  translatedText: string;
  timestamp: string;
}

const INITIAL_COMMENTS: SimulatedComment[] = [
  {
    id: 'c1',
    user: 'Sipho_Dbn',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&auto=format&fit=crop&q=80',
    originFlag: '🇿🇦',
    sourceLang: 'isiZulu',
    targetLang: 'English',
    originalText: 'Unjani mntakwethu! Le vibe iyashisa!',
    translatedText: 'How are you brother! This vibe is truly on fire!',
    timestamp: 'Just now',
  },
  {
    id: 'c2',
    user: 'Amara_Lagos',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&auto=format&fit=crop&q=80',
    originFlag: '🇳🇬',
    sourceLang: 'Yorùbá',
    targetLang: 'English',
    originalText: 'Ẹ kú iṣẹ́ o! Iná ń jó níbí!',
    translatedText: 'Great work! The fire is definitely burning here!',
    timestamp: '2s ago',
  },
  {
    id: 'c3',
    user: 'Juma_Nairobi',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80',
    originFlag: '🇰🇪',
    sourceLang: 'Kiswahili',
    targetLang: 'English',
    originalText: 'Nairobi inawakilisha! Muziki huu ni safi sana.',
    translatedText: 'Nairobi is representing! This music is super clean.',
    timestamp: '5s ago',
  },
];

export default function HeroSection() {
  const { openAuthModal, user } = useAuth();
  const [secondsLeft, setSecondsLeft] = useState(84); // 84s of 120s
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [reactions, setReactions] = useState<{ id: number; emoji: string; left: number }[]>([]);
  const [inputMsg, setInputMsg] = useState('');
  const [comments, setComments] = useState<SimulatedComment[]>(INITIAL_COMMENTS);
  const [showOriginal, setShowOriginal] = useState(false);

  // 120-second live timer countdown
  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          return 120; // reset loop for demo
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const newComment: SimulatedComment = {
      id: `comm_${Date.now()}`,
      user: user ? user.handle.replace('@', '') : 'Guest_Africa',
      avatar: user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80',
      originFlag: '🇿🇦',
      sourceLang: user?.nativeLanguage || 'isiXhosa',
      targetLang: user?.targetLanguage || 'English',
      originalText: inputMsg,
      translatedText: `[Live AI Translated] ${inputMsg}`,
      timestamp: 'Just now',
    };

    setComments((prev) => [newComment, ...prev.slice(0, 4)]);
    setInputMsg('');
    triggerReaction('🔥');
  };

  const triggerReaction = (emoji: string) => {
    const id = Date.now() + Math.random();
    const left = 20 + Math.random() * 60; // percentage
    setReactions((prev) => [...prev, { id, emoji, left }]);
    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== id));
    }, 1800);
  };

  // Progress for 120-second circle
  const progressPercent = ((120 - secondsLeft) / 120) * 100;
  const strokeDashoffset = 283 - (283 * progressPercent) / 100;

  return (
    <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32">
      {/* Background Radial Ambiance */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-[600px] w-[600px] rounded-full bg-gradient-to-br from-orange-600/20 via-amber-600/10 to-transparent blur-[120px]" />
        <div className="absolute top-1/4 right-1/4 h-[350px] w-[350px] rounded-full bg-emerald-600/10 blur-[90px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Manifesto & Value Proposition */}
          <div className="lg:col-span-6 space-y-8 text-center lg:text-left">
            {/* Urgency & Platform Tag */}
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-300 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>THE PAN-AFRICAN IMMEDIATE SOCIAL NETWORK</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
              Africa. <span className="african-sunset-text">Live.</span> Connected.
            </h1>

            {/* Core Manifesto */}
            <p className="text-lg sm:text-xl text-zinc-300 font-normal leading-relaxed">
              The product rule is uncompromising: <strong className="text-white font-semibold">Everything is immediate, social and temporary.</strong> Experience rapid 2-minute live streams, 48-hour self-destructing moments, and real-time AI voice translation across 50+ African languages.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => openAuthModal('signup')}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-full african-sunset-gradient px-8 py-4 text-base font-bold text-white shadow-xl shadow-orange-600/25 hover:scale-[1.02] active:scale-95 transition-all"
              >
                <Radio className="h-5 w-5 text-white animate-pulse" />
                Go Live (120s Cap)
              </button>

              <a
                href="#ai-translator"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full border border-white/15 bg-zinc-900/70 px-7 py-4 text-base font-semibold text-zinc-200 hover:border-amber-400/40 hover:bg-zinc-800 transition-all backdrop-blur-md"
              >
                <Sparkles className="h-4 w-4 text-emerald-400" />
                Test AI Translation
              </a>
            </div>

            {/* 4 Pillars Summary Badges */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-white/10 text-left">
              <div className="p-2.5 rounded-xl bg-zinc-900/40 border border-white/5">
                <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
                  <Clock className="h-3.5 w-3.5" />
                  120s Max
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5">High-energy live streams</p>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-900/40 border border-white/5">
                <div className="flex items-center gap-1 text-xs font-bold text-rose-400">
                  <Flame className="h-3.5 w-3.5" />
                  48h Expiry
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5">Zero digital clutter</p>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-900/40 border border-white/5">
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                  <Globe className="h-3.5 w-3.5" />
                  Yethu AI
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5">Native multi-language</p>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-900/40 border border-white/5">
                <div className="flex items-center gap-1 text-xs font-bold text-cyan-400">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  InsForge
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5">Instant secure backend</p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive 2-Minute Live Stream Simulator */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-zinc-950/90 shadow-2xl backdrop-blur-2xl overflow-hidden">
              {/* Top Stream Header */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-zinc-900">
                {/* Stream Video Background Simulation */}
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80"
                  alt="Live Creator Broadcaster"
                  className="h-full w-full object-cover brightness-[0.8] contrast-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-black/40" />

                {/* Live Floating Reaction Particles */}
                {reactions.map((r) => (
                  <div
                    key={r.id}
                    style={{ left: `${r.left}%` }}
                    className="pointer-events-none absolute bottom-6 text-2xl animate-bounce"
                  >
                    {r.emoji}
                  </div>
                ))}

                {/* Overlaid Status Bar */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  {/* Broadcaster Info */}
                  <div className="flex items-center gap-2.5 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur-md border border-white/10">
                    <span className="text-base">🇿🇦</span>
                    <div>
                      <p className="text-xs font-bold text-white leading-tight">Nandi in Soweto</p>
                      <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                        1,428 watching live
                      </p>
                    </div>
                  </div>

                  {/* 120s Circular Countdown Gauge */}
                  <div className="relative flex items-center justify-center">
                    <svg className="h-14 w-14 transform -rotate-90">
                      <circle
                        cx="28"
                        cy="28"
                        r="22"
                        stroke="rgba(255, 255, 255, 0.15)"
                        strokeWidth="4"
                        fill="transparent"
                      />
                      <circle
                        cx="28"
                        cy="28"
                        r="22"
                        stroke={secondsLeft < 30 ? '#ef4444' : '#f59e0b'}
                        strokeWidth="4"
                        strokeDasharray="138"
                        strokeDashoffset={138 - (138 * (120 - secondsLeft)) / 120}
                        strokeLinecap="round"
                        fill="rgba(0, 0, 0, 0.4)"
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className={`text-xs font-black font-mono ${secondsLeft < 30 ? 'text-rose-400 animate-urgent' : 'text-amber-400'}`}>
                        {secondsLeft}s
                      </span>
                      <span className="text-[7px] uppercase font-bold text-zinc-400">Cap</span>
                    </div>
                  </div>
                </div>

                {/* Bottom of Stream: Speech Audio Waveform & Translated Subtitles */}
                <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-black/75 p-2.5 backdrop-blur-md border border-amber-500/20">
                  <div className="flex items-center justify-between text-[11px] text-amber-400 font-semibold mb-1">
                    <div className="flex items-center gap-1.5">
                      <Volume2 className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
                      <span>Live Speech (isiZulu)</span>
                    </div>
                    <span className="text-[10px] text-emerald-400">● AI Translated Subtitles</span>
                  </div>
                  <p className="text-xs text-white font-medium italic">
                    &quot;Sanibonani nonke! Namhlanje sikhuluma ngamaphupho ase-Afrika...&quot;
                  </p>
                  <p className="text-[11px] text-zinc-300 mt-0.5 font-normal">
                    &quot;Greetings everyone! Today we are speaking of African dreams...&quot;
                  </p>
                </div>
              </div>

              {/* Real-time Multi-Language Chat Stream */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-200">Live Multilingual Chat</span>
                    <span className="rounded bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.5 font-mono">
                      Auto-Translating
                    </span>
                  </div>
                  <button
                    onClick={() => setShowOriginal(!showOriginal)}
                    className="text-[10px] text-zinc-400 hover:text-amber-400 transition-colors"
                  >
                    {showOriginal ? 'Show Translated' : 'Show Original'}
                  </button>
                </div>

                {/* Comment Feed Items */}
                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {comments.map((comm) => (
                    <div
                      key={comm.id}
                      className="rounded-xl bg-zinc-900/60 p-2.5 border border-white/5 text-xs transition-all hover:border-white/15"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm">{comm.originFlag}</span>
                          <span className="font-bold text-zinc-200">@{comm.user}</span>
                          <span className="text-[10px] text-amber-400/80 font-mono">
                            [{comm.sourceLang} ➔ {comm.targetLang}]
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-500">{comm.timestamp}</span>
                      </div>
                      <p className="text-zinc-200 leading-snug">
                        {showOriginal ? comm.originalText : comm.translatedText}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Live Input & Reactions Bar */}
                <form onSubmit={handleSendComment} className="pt-2 flex items-center gap-2">
                  <input
                    type="text"
                    value={inputMsg}
                    onChange={(e) => setInputMsg(e.target.value)}
                    placeholder="Comment in your mother tongue..."
                    className="flex-1 rounded-full bg-zinc-900 border border-white/15 px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    className="rounded-full bg-amber-500 hover:bg-amber-400 p-2 text-black transition-colors"
                    title="Send comment"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </form>

                {/* Rapid Reaction Bar */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5">
                    {['🔥', '🇿🇦', '🇳🇬', '🇰🇪', '❤️', '⚡'].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => triggerReaction(emoji)}
                        className="rounded-lg bg-zinc-900 hover:bg-zinc-800 p-1.5 text-sm transition-transform active:scale-125"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] text-zinc-500">Tap to react</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
