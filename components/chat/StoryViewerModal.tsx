'use client';

import React, { useState, useEffect } from 'react';
import { StoryItem } from '@/lib/chatData';
import { X, Clock, Play, Pause, Volume2, Eye, Flame, Share2, Sparkles } from 'lucide-react';

interface StoryViewerModalProps {
  story: StoryItem | null;
  onClose: () => void;
}

export default function StoryViewerModal({ story, onClose }: StoryViewerModalProps) {
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [reactions, setReactions] = useState<{ id: number; emoji: string; left: number }[]>([]);

  useEffect(() => {
    if (!story) return;
    setProgress(0);

    const interval = setInterval(() => {
      if (!isPaused) {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 1.5;
        });
      }
    }, 100);

    return () => clearInterval(interval);
  }, [story, isPaused]);

  if (!story) return null;

  const triggerReaction = (emoji: string) => {
    const id = Date.now() + Math.random();
    const left = 30 + Math.random() * 40;
    setReactions((prev) => [...prev, { id, emoji, left }]);
    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== id));
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md aspect-[9/16] max-h-[85vh] rounded-3xl overflow-hidden border border-white/20 bg-zinc-950 shadow-2xl flex flex-col justify-between">
        {/* Story Background Visual */}
        <div className="absolute inset-0 z-0">
          <img
            src={story.previewImage}
            alt={story.creatorName}
            className="h-full w-full object-cover brightness-[0.9]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/70" />
        </div>

        {/* Floating Reactions */}
        {reactions.map((r) => (
          <div
            key={r.id}
            style={{ left: `${r.left}%` }}
            className="pointer-events-none absolute bottom-20 text-3xl animate-bounce z-30"
          >
            {r.emoji}
          </div>
        ))}

        {/* Top Header: Progress Bar & Creator Details */}
        <div className="relative z-20 p-4 space-y-3">
          {/* Progress Bar */}
          <div className="h-1 w-full rounded-full bg-white/20 overflow-hidden">
            <div
              style={{ width: `${progress}%` }}
              className="h-full african-sunset-gradient transition-all duration-100 ease-linear"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={story.creatorAvatar}
                alt={story.creatorName}
                className="h-9 w-9 rounded-full object-cover border-2 border-amber-500"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">{story.creatorName}</span>
                  <span className="text-xs">{story.countryFlag}</span>
                  {story.isReplay && (
                    <span className="rounded bg-rose-600 px-1.5 py-0.5 text-[8px] font-black text-white uppercase">
                      Replay
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-amber-400 font-mono">
                  <Clock className="h-2.5 w-2.5" />
                  <span>Available for {story.timeRemaining}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="p-1.5 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
                title={isPaused ? 'Resume' : 'Pause'}
              >
                {isPaused ? <Play className="h-3.5 w-3.5 fill-white" /> : <Pause className="h-3.5 w-3.5 fill-white" />}
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Content & Interactive Reactions */}
        <div className="relative z-20 p-4 space-y-3">
          {story.title && (
            <div className="rounded-xl bg-black/70 p-3 backdrop-blur-md border border-white/10">
              <p className="text-xs font-bold text-white leading-snug">{story.title}</p>
              <div className="flex items-center justify-between mt-1 text-[10px] text-zinc-400">
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3 text-zinc-400" />
                  {story.views || '1.4k views'}
                </span>
                <span className="text-rose-400 font-mono">Self-destructs in 48h</span>
              </div>
            </div>
          )}

          {/* Quick Reaction Bar */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              {['🔥', '🇿🇦', '🇳🇬', '❤️', '⚡', '👏'].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => triggerReaction(emoji)}
                  className="h-9 w-9 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md flex items-center justify-center text-lg active:scale-125 transition-transform border border-white/10"
                >
                  {emoji}
                </button>
              ))}
            </div>

            <button
              onClick={() => triggerReaction('🔥')}
              className="flex items-center gap-1 rounded-full african-sunset-gradient px-3 py-1.5 text-xs font-bold text-white shadow-md"
            >
              <Flame className="h-3.5 w-3.5 fill-white" />
              <span>Hype</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
