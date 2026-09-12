'use client';

import React from 'react';
import { Flame, Clock, Play, Eye, Share2 } from 'lucide-react';

interface EphemeralPost {
  id: string;
  creator: string;
  handle: string;
  avatar: string;
  coverImage: string;
  title: string;
  category: string;
  city: string;
  flag: string;
  views: string;
  hoursRemaining: number;
  minutesRemaining: number;
  language: string;
}

const SAMPLE_POSTS: EphemeralPost[] = [
  {
    id: 'ep1',
    creator: 'Themba Khumalo',
    handle: '@themba_beats',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    title: 'Amapiano Log Drum Breakdown Live in Studio',
    category: 'Music & Culture',
    city: 'Pretoria',
    flag: '🇿🇦',
    views: '3.4k',
    hoursRemaining: 17,
    minutesRemaining: 24,
    language: 'isiZulu',
  },
  {
    id: 'ep2',
    creator: 'Zainab Touré',
    handle: '@zainab_dakar',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
    title: 'Secret Thiéboudienne street recipe in 120s',
    category: 'Food & Life',
    city: 'Dakar',
    flag: '🇸🇳',
    views: '5.1k',
    hoursRemaining: 6,
    minutesRemaining: 12,
    language: 'Français / Wolof',
  },
  {
    id: 'ep3',
    creator: 'Chidi Okafor',
    handle: '@chidi_tech',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    title: 'How we build AI in Yaba Tech Hub with Zero Latency',
    category: 'Tech & Build',
    city: 'Lagos',
    flag: '🇳🇬',
    views: '8.9k',
    hoursRemaining: 41,
    minutesRemaining: 55,
    language: 'Yorùbá / English',
  },
  {
    id: 'ep4',
    creator: 'Amina Wanjiku',
    handle: '@amina_runs',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600&auto=format&fit=crop&q=80',
    title: 'Morning Rift Valley Training Run Views',
    category: 'Fitness & Nature',
    city: 'Eldoret',
    flag: '🇰🇪',
    views: '2.8k',
    hoursRemaining: 1,
    minutesRemaining: 48,
    language: 'Kiswahili',
  },
];

export default function PillarEphemeralFeed() {
  return (
    <section id="ephemeral-feed" className="py-20 lg:py-28 relative border-t border-white/10 bg-[#08090a]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Pill */}
        <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-1 text-xs font-bold text-rose-400">
            <Flame className="h-3.5 w-3.5" />
            PRINCIPLE 2: 48-HOUR EPHEMERAL CONTENT
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Nothing lives forever. Enjoy the moment.
          </h2>
          <p className="text-base sm:text-lg text-zinc-400">
            Every replay, uploaded moment, and live session self-destructs after <strong className="text-rose-400 font-semibold">48 hours</strong>. No anxiety over permanent history, no algorithmic graveyards. The UI actively counts down every second.
          </p>
        </div>

        {/* Live Ticking Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SAMPLE_POSTS.map((post) => {
            const isUrgent = post.hoursRemaining < 3;
            return (
              <div
                key={post.id}
                className="group relative rounded-2xl border border-white/10 bg-zinc-900/60 overflow-hidden glass-card-hover transition-all flex flex-col"
              >
                {/* Media Preview Box */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-800">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-black/30" />

                  {/* 48h Countdown Badge (Exact PRD requirement) */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <div
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold backdrop-blur-md shadow-md ${
                        isUrgent
                          ? 'bg-rose-600/90 text-white animate-pulse border border-rose-400/50'
                          : 'bg-black/75 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      <Clock className="h-3 w-3" />
                      <span>Available for {post.hoursRemaining}h {post.minutesRemaining}m</span>
                    </div>

                    <span className="rounded-full bg-black/60 px-2 py-0.5 text-xs backdrop-blur-sm border border-white/10">
                      {post.flag}
                    </span>
                  </div>

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-black shadow-xl shadow-amber-500/40">
                      <Play className="h-5 w-5 fill-black ml-0.5" />
                    </div>
                  </div>

                  {/* City & Views bottom strip */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-zinc-300">
                    <span className="font-semibold text-white">{post.city}</span>
                    <span className="flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-sm">
                      <Eye className="h-3 w-3 text-zinc-400" />
                      {post.views}
                    </span>
                  </div>
                </div>

                {/* Post Footer & Creator */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">
                      {post.category}
                    </span>
                    <h3 className="text-sm font-bold text-white line-clamp-2 mt-1 group-hover:text-amber-300 transition-colors">
                      {post.title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <img
                        src={post.avatar}
                        alt={post.creator}
                        className="h-7 w-7 rounded-full object-cover border border-white/10"
                      />
                      <div>
                        <p className="text-xs font-semibold text-zinc-200 leading-tight">{post.creator}</p>
                        <p className="text-[10px] text-zinc-500">{post.language}</p>
                      </div>
                    </div>

                    <button
                      className="text-zinc-400 hover:text-white p-1 rounded-md hover:bg-white/5 transition-colors"
                      title="Share link (valid 48h)"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* PRD Highlight Card */}
        <div className="mt-12 rounded-2xl border border-white/10 bg-gradient-to-r from-zinc-900/60 via-amber-950/20 to-zinc-900/60 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-bold text-white flex items-center justify-center sm:justify-start gap-2">
              <Clock className="h-5 w-5 text-amber-400" />
              Automated InsForge 48-Hour TTL Engine
            </h3>
            <p className="text-sm text-zinc-400 max-w-2xl">
              Backed by PostgreSQL scheduled cleanup routines and InsForge S3 lifecycle rules. Storage costs stay low, privacy stays intact, and community feeds stay fresh.
            </p>
          </div>

          <div className="shrink-0">
            <div className="inline-flex items-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/30 px-4 py-2 text-xs font-mono font-bold text-amber-300">
              48h 00m 00s ➔ 0h 00m 00s [DELETE]
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
