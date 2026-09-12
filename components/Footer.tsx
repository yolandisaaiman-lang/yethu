'use client';

import React from 'react';
import { Radio, Flame, Sparkles, Heart, Shield, Cpu } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Footer() {
  const { openAuthModal, user } = useAuth();

  return (
    <footer className="border-t border-white/10 bg-[#060708] text-zinc-400">
      {/* Continental Call to Action Banner */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-3xl border border-amber-500/30 african-sunset-gradient p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-2xl shadow-orange-600/20">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">
            Africa is broadcasting. Are you plugged in?
          </h2>
          <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto mb-8">
            Experience the new standard of African social media. 2-minute live streams, 48-hour temporary moments, and zero language barriers.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => openAuthModal('signup')}
              className="rounded-full bg-black px-8 py-3.5 text-sm font-bold text-white hover:bg-zinc-900 transition-all shadow-xl shadow-black/30"
            >
              {user ? 'Open Creator Studio' : 'Get Started Now — It’s Free'}
            </button>
            <a
              href="#live-principle"
              className="rounded-full border border-white/30 bg-white/10 backdrop-blur-md px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/20 transition-all"
            >
              Explore 2-Min Live
            </a>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mt-16 pt-12 border-t border-white/10">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg african-sunset-gradient text-white font-black text-sm">
                Y
              </div>
              <span className="text-xl font-black text-white font-mono tracking-tight">
                YETHU
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Africa. Live. Connected. An immediate, social, and temporary communication network for 1.4 billion people and the global diaspora.
            </p>
            <div className="flex items-center gap-1.5 text-base">
              <span>🇿🇦</span>
              <span>🇳🇬</span>
              <span>🇰🇪</span>
              <span>🇪🇹</span>
              <span>🇬🇭</span>
              <span>🇨🇮</span>
              <span>🇸🇳</span>
              <span>🇷🇼</span>
            </div>
          </div>

          {/* Product Pillars */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-white">The 3 Principles</p>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#live-principle" className="hover:text-amber-400 flex items-center gap-1.5 transition-colors">
                  <Radio className="h-3.5 w-3.5 text-rose-500" />
                  Principle 1 — 2-Min Live (120s)
                </a>
              </li>
              <li>
                <a href="#ephemeral-feed" className="hover:text-amber-400 flex items-center gap-1.5 transition-colors">
                  <Flame className="h-3.5 w-3.5 text-amber-500" />
                  Principle 2 — 48-Hour Vault
                </a>
              </li>
              <li>
                <a href="#ai-translator" className="hover:text-amber-400 flex items-center gap-1.5 transition-colors">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                  Principle 3 — Yethu AI
                </a>
              </li>
            </ul>
          </div>

          {/* Infrastructure */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-white">Cloud Infrastructure</p>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5 text-amber-400" />
                <span>Next.js 16 App Router & PWA</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-cyan-400" />
                <span>InsForge BaaS (Postgres + RLS)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Radio className="h-3.5 w-3.5 text-rose-400" />
                <span>LiveKit WebRTC Low Latency</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                <span>OpenAI Realtime Translation</span>
              </li>
            </ul>
          </div>

          {/* Languages Supported */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-white">Languages Active</p>
            <p className="text-xs text-zinc-400 leading-relaxed">
              isiXhosa, isiZulu, Kiswahili, Yorùbá, Igbo, Amharic, Afrikaans, French, Hausa, Lingala, and English.
            </p>
            <div className="pt-2">
              <span className="inline-block rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 text-[10px] font-mono text-emerald-300">
                ● LiveKit & InsForge Active
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} YETHU. Built with pride for Africa and the Diaspora.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-zinc-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">48h Content Rules</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Developer API</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
