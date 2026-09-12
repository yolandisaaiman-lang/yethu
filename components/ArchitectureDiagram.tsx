'use client';

import React, { useState } from 'react';
import { Layers, Database, Radio, Bot, ShieldCheck, Server, Globe } from 'lucide-react';

export default function ArchitectureDiagram() {
  const [activeTab, setActiveTab] = useState<'flow' | 'stack'>('flow');

  return (
    <section id="architecture" className="py-20 lg:py-28 relative border-t border-white/10 bg-[#090a0c]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Pill */}
        <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1 text-xs font-bold text-cyan-400">
            <Layers className="h-3.5 w-3.5" />
            TECHNICAL PRD ARCHITECTURE
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Engineered for Africa-Scale Concurrency
          </h2>
          <p className="text-base sm:text-lg text-zinc-400">
            A harmonized triad of Next.js App Router, InsForge BaaS (PostgreSQL + Realtime), LiveKit WebRTC edge networks, and OpenAI speech-to-speech translation pipelines.
          </p>

          {/* Toggle */}
          <div className="flex items-center rounded-full bg-zinc-900 p-1 border border-white/10 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('flow')}
              className={`rounded-full px-4 py-1.5 transition-all ${
                activeTab === 'flow'
                  ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              PRD System Flow
            </button>
            <button
              onClick={() => setActiveTab('stack')}
              className={`rounded-full px-4 py-1.5 transition-all ${
                activeTab === 'stack'
                  ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Integrated Cloud Stack
            </button>
          </div>
        </div>

        {/* View 1: PRD Tree Diagram (Matches uploaded diagram) */}
        {activeTab === 'flow' ? (
          <div className="rounded-3xl border border-white/15 bg-zinc-950/80 p-6 sm:p-12 shadow-2xl backdrop-blur-2xl">
            {/* Tree Node: Root YETHU */}
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="rounded-2xl african-sunset-gradient px-8 py-3.5 text-center shadow-lg shadow-orange-500/25">
                  <span className="text-2xl font-black tracking-wider text-white font-mono">
                    YETHU
                  </span>
                  <p className="text-[10px] text-white/90 font-medium tracking-wide">
                    Africa. Live. Connected.
                  </p>
                </div>
              </div>

              {/* Vertical connector */}
              <div className="h-10 w-0.5 bg-gradient-to-b from-amber-500 to-zinc-600" />
              <div className="w-full max-w-2xl h-0.5 bg-zinc-700 relative">
                {/* Branches */}
                <div className="absolute -top-1 left-0 h-3 w-0.5 bg-zinc-600" />
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 h-3 w-0.5 bg-zinc-600" />
                <div className="absolute -top-1 right-0 h-3 w-0.5 bg-zinc-600" />
              </div>
              <div className="w-full max-w-2xl flex justify-between">
                <div className="h-6 w-0.5 bg-zinc-600" />
                <div className="h-6 w-0.5 bg-zinc-600" />
                <div className="h-6 w-0.5 bg-zinc-600" />
              </div>

              {/* 3 Core Experience Modules */}
              <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                {/* Module 1: VIDEO */}
                <div className="rounded-2xl border border-rose-500/30 bg-zinc-900/90 p-5 shadow-lg space-y-2">
                  <span className="rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                    MODULE 01
                  </span>
                  <h4 className="text-xl font-black text-white">VIDEO</h4>
                  <div className="inline-block rounded-xl bg-rose-500/10 border border-rose-500/30 px-3 py-1.5 text-xs font-mono font-bold text-rose-300">
                    48-Hour Content
                  </div>
                  <p className="text-xs text-zinc-400">
                    Uploaded videos, moments & live replays automatically expire after 48h.
                  </p>
                </div>

                {/* Module 2: LIVE */}
                <div className="rounded-2xl border border-amber-500/30 bg-zinc-900/90 p-5 shadow-lg space-y-2">
                  <span className="rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                    MODULE 02
                  </span>
                  <h4 className="text-xl font-black text-white">LIVE</h4>
                  <div className="inline-block rounded-xl bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 text-xs font-mono font-bold text-amber-300">
                    2-Minute Streams
                  </div>
                  <p className="text-xs text-zinc-400">
                    Creator sessions capped strictly at 120s via low-latency WebRTC.
                  </p>
                </div>

                {/* Module 3: CHAT */}
                <div className="rounded-2xl border border-cyan-500/30 bg-zinc-900/90 p-5 shadow-lg space-y-2">
                  <span className="rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                    MODULE 03
                  </span>
                  <h4 className="text-xl font-black text-white">CHAT</h4>
                  <div className="inline-block rounded-xl bg-cyan-500/10 border border-cyan-500/30 px-3 py-1.5 text-xs font-mono font-bold text-cyan-300">
                    Messenger
                  </div>
                  <p className="text-xs text-zinc-400">
                    Real-time community messenger backed by InsForge Realtime sockets.
                  </p>
                </div>
              </div>

              {/* Converging connector into YETHU AI */}
              <div className="w-full max-w-2xl flex justify-between">
                <div className="h-6 w-0.5 bg-zinc-600" />
                <div className="h-6 w-0.5 bg-zinc-600" />
                <div className="h-6 w-0.5 bg-zinc-600" />
              </div>
              <div className="w-full max-w-2xl h-0.5 bg-zinc-700" />
              <div className="h-10 w-0.5 bg-gradient-to-b from-zinc-600 to-emerald-500" />

              {/* Central Core: YETHU AI */}
              <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/40 px-8 py-3.5 text-center backdrop-blur-md shadow-lg shadow-emerald-500/15">
                <span className="text-xl font-black tracking-wider text-emerald-300 font-mono flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  YETHU AI
                </span>
                <p className="text-[11px] text-zinc-300">Pan-African Multimodal Language Matrix</p>
              </div>

              {/* Output branches of AI */}
              <div className="h-8 w-0.5 bg-zinc-600" />
              <div className="w-full max-w-xl h-0.5 bg-zinc-700 relative">
                <div className="absolute -top-1 left-0 h-3 w-0.5 bg-zinc-600" />
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 h-3 w-0.5 bg-zinc-600" />
                <div className="absolute -top-1 right-0 h-3 w-0.5 bg-zinc-600" />
              </div>
              <div className="w-full max-w-xl flex justify-between">
                <div className="h-5 w-0.5 bg-zinc-600" />
                <div className="h-5 w-0.5 bg-zinc-600" />
                <div className="h-5 w-0.5 bg-zinc-600" />
              </div>

              {/* 3 AI Sub-Systems */}
              <div className="w-full max-w-2xl grid grid-cols-3 gap-4 text-center">
                <div className="rounded-xl border border-white/10 bg-zinc-900/80 p-3">
                  <p className="text-xs font-bold text-white">Translate</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">50+ African dialects</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-zinc-900/80 p-3">
                  <p className="text-xs font-bold text-white">Voice</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">Whisper & speech synthesis</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-zinc-900/80 p-3">
                  <p className="text-xs font-bold text-white">Captions</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">Sub-second live video sync</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* View 2: Cloud Infrastructure & BaaS Layer */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Next.js UI / API */}
            <div className="rounded-2xl border border-white/15 bg-zinc-950 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-zinc-800 text-white">
                  <Server className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Next.js App Router</h4>
                  <p className="text-xs text-zinc-400">PWA + React Native ready</p>
                </div>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Mobile-first responsive interface, Edge server routes, and fast SSR/client hydration.
              </p>
              <div className="pt-2 border-t border-white/10 text-[11px] text-zinc-400 space-y-1 font-mono">
                <div>✓ Web-first PWA manifests</div>
                <div>✓ Standalone install ready</div>
                <div>✓ Low-overhead client bundle</div>
              </div>
            </div>

            {/* InsForge BaaS */}
            <div className="rounded-2xl border border-amber-500/40 bg-zinc-950 p-6 space-y-4 shadow-xl shadow-amber-500/10">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400">
                  <Database className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">InsForge BaaS (v1.5.2)</h4>
                  <p className="text-xs text-amber-400 font-mono">7rniavv5.us-east.insforge.app</p>
                </div>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                All-in-one Postgres backend handling authentication, RLS, storage buckets, and realtime websockets.
              </p>
              <div className="pt-2 border-t border-white/10 text-[11px] text-zinc-400 space-y-1 font-mono">
                <div>✓ InsForge Auth & JWT sessions</div>
                <div>✓ PostgreSQL user & stream tables</div>
                <div>✓ 48h TTL automated storage</div>
                <div>✓ Realtime socket messenger</div>
              </div>
            </div>

            {/* LiveKit + OpenAI AI Engine */}
            <div className="rounded-2xl border border-white/15 bg-zinc-950 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Radio className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">LiveKit & OpenAI</h4>
                  <p className="text-xs text-emerald-400">WebRTC + Neural AI</p>
                </div>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Sub-second WebRTC video streaming rooms with integrated speech-to-text and AI translation pipelines.
              </p>
              <div className="pt-2 border-t border-white/10 text-[11px] text-zinc-400 space-y-1 font-mono">
                <div>✓ 120s max stream room lifecycle</div>
                <div>✓ Selective Forwarding Unit (SFU)</div>
                <div>✓ Realtime Whisper audio streams</div>
                <div>✓ Pan-African multilingual models</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
