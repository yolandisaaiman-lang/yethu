'use client';

import React, { useState } from 'react';
import { Timer, Zap, Play, RotateCcw, AlertTriangle, Users } from 'lucide-react';

export default function PillarLiveTwoMinutes() {
  const [seconds, setSeconds] = useState(120);
  const [isActive, setIsActive] = useState(false);

  React.useEffect(() => {
    let interval: any = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setSeconds(120);
  };

  const minutes = Math.floor(seconds / 60);
  const remSec = seconds % 60;
  const formattedTime = `${minutes}:${remSec < 10 ? '0' : ''}${remSec}`;

  return (
    <section id="live-principle" className="py-20 lg:py-28 relative border-t border-white/10 bg-zinc-950/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Pill */}
        <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1 text-xs font-bold text-orange-400">
            <Timer className="h-3.5 w-3.5" />
            PRINCIPLE 1: THE 2-MINUTE REVOLUTION
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            A creator cannot stream indefinitely.
          </h2>
          <p className="text-base sm:text-lg text-zinc-400">
            Every Yethu Live session is strictly capped at <strong className="text-amber-400 font-semibold">120 seconds</strong>. No rambling, no awkward silences, no stream fatigue. Just raw African energy, spontaneity, and high-voltage focus.
          </p>
        </div>

        {/* 3 Value Grid + Interactive 120s Demo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: 3 Core Benefits */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass-card p-6 rounded-2xl border border-white/10 flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Peak Audience Attention</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Viewers know the stream will end in 2 minutes, creating instant urgency and massive concurrent engagement. Nobody leaves a 120-second moment.
                </p>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-white/10 flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Sub-Second LiveKit WebRTC</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Built on top of ultra-low latency LiveKit edge nodes across the continent. Creators broadcast crystal-clear video with real-time feedback.
                </p>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-white/10 flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Democratized Creator Stage</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  You don’t need hours of scheduled production. A street dancer in Maputo or a chef in Dakar can share a brilliant 2-minute glimpse anytime.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Interactive 120s Control Simulator */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-b from-zinc-900/90 to-zinc-950 p-8 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 rounded-full bg-orange-500/10 blur-2xl" />

              <span className="text-xs font-bold text-zinc-400 tracking-wider uppercase">
                Creator Broadcast Timer Demo
              </span>

              <div className="my-8 flex justify-center">
                <div className="relative flex h-48 w-48 items-center justify-center rounded-full border-4 border-zinc-800 bg-zinc-950/80 shadow-inner">
                  <div className="text-center">
                    <span className={`text-4xl font-black font-mono tracking-tight ${seconds <= 20 ? 'text-rose-500 animate-urgent' : 'text-amber-400'}`}>
                      {formattedTime}
                    </span>
                    <p className="text-xs text-zinc-400 mt-1 font-medium">
                      {seconds === 0 ? 'Session Ended' : `${seconds}s Remaining`}
                    </p>
                  </div>

                  {/* Outer glowing border ring indicator */}
                  <div
                    className="absolute inset-0 rounded-full border-4 border-transparent border-t-amber-500 transition-all duration-300"
                    style={{ transform: `rotate(${(120 - seconds) * 3}deg)` }}
                  />
                </div>
              </div>

              {/* Status Warning */}
              {seconds <= 30 && seconds > 0 && (
                <div className="mb-4 rounded-xl bg-rose-500/15 border border-rose-500/30 p-2 text-xs text-rose-300 font-semibold animate-pulse">
                  ⚡ 30s Final Wrap-Up Warning!
                </div>
              )}

              {/* Timer Controls */}
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={toggleTimer}
                  className="flex items-center gap-2 rounded-full african-sunset-gradient px-6 py-2.5 text-xs font-bold text-white hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-orange-500/20"
                >
                  <Play className="h-3.5 w-3.5 fill-white" />
                  {isActive ? 'Pause Demo' : 'Start 120s Live'}
                </button>

                <button
                  onClick={resetTimer}
                  className="flex items-center gap-1.5 rounded-full border border-white/10 bg-zinc-800/80 px-4 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-700 transition-all"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </button>
              </div>

              <p className="text-[11px] text-zinc-500 mt-4">
                At 0:00, the stream automatically converts to a 48-hour temporary replay.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
