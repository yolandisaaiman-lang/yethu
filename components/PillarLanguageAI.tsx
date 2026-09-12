'use client';

import React, { useState } from 'react';
import { AFRICAN_LANGUAGES, LanguageOption } from '@/lib/languages';
import { Globe, Sparkles, Volume2, Mic, ArrowRight, Check, Play, RefreshCw } from 'lucide-react';

export default function PillarLanguageAI() {
  const [sourceLang, setSourceLang] = useState<LanguageOption>(AFRICAN_LANGUAGES[0]); // isiXhosa
  const [targetLang, setTargetLang] = useState<LanguageOption>(AFRICAN_LANGUAGES[6]); // Afrikaans
  const [activePhraseIndex, setActivePhraseIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [customText, setCustomText] = useState('');

  const currentPhrase = sourceLang.samplePhrases[activePhraseIndex] || sourceLang.samplePhrases[0];

  const handleSimulateVoice = () => {
    setIsPlayingAudio(true);
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 2400);
  };

  const handleSwap = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
    setActivePhraseIndex(0);
  };

  return (
    <section id="ai-translator" className="py-20 lg:py-28 relative border-t border-white/10 bg-zinc-950/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Pill */}
        <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1 text-xs font-bold text-emerald-400">
            <Globe className="h-3.5 w-3.5" />
            PRINCIPLE 3: LANGUAGE SHOULD NOT BE A BARRIER
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Speak your mother tongue. Africa understands.
          </h2>
          <p className="text-base sm:text-lg text-zinc-400">
            Powered by Yethu AI and OpenAI Realtime models. Whether speaking isiXhosa, Swahili, Yorùbá, or Amharic, conversations flow without barriers across text, voice, and live video.
          </p>
        </div>

        {/* 4 Translation Engines Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              Text ➔ Translation
            </div>
            <p className="text-xs text-zinc-300">
              Instant live chat auto-translation preserved inside the 120s live stream box.
            </p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <Mic className="h-3.5 w-3.5 text-emerald-400" />
              Voice ➔ Transcription
            </div>
            <p className="text-xs text-zinc-300">
              High-accuracy whisper transcription trained on African accents and colloquial dialects.
            </p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              Live Speech ➔ Captions
            </div>
            <p className="text-xs text-zinc-300">
              Subtitles overlaying live broadcasts in real-time, synchronized with LiveKit streams.
            </p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-400">
              <Volume2 className="h-3.5 w-3.5 text-rose-400" />
              Voice ➔ Translated Voice
            </div>
            <p className="text-xs text-zinc-300">
              Instant voice synthesis delivering translated speech with natural African tonality.
            </p>
          </div>
        </div>

        {/* Interactive Translation Matrix Sandbox */}
        <div className="rounded-3xl border border-white/15 bg-zinc-900/80 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-400" />
                Interactive Yethu AI Translation Sandbox
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Experience real-time cross-continental translation live in your browser
              </p>
            </div>

            {/* Language Pair Selectors */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Source Lang */}
              <div className="flex-1 sm:flex-initial">
                <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                  My Language
                </label>
                <select
                  value={sourceLang.code}
                  onChange={(e) => {
                    const found = AFRICAN_LANGUAGES.find((l) => l.code === e.target.value);
                    if (found) {
                      setSourceLang(found);
                      setActivePhraseIndex(0);
                    }
                  }}
                  className="w-full rounded-xl bg-zinc-950 border border-white/15 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  {AFRICAN_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.flag} {l.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Swap Button */}
              <button
                onClick={handleSwap}
                className="mt-4 rounded-full bg-zinc-800 hover:bg-zinc-700 p-2 text-zinc-300 hover:text-white transition-colors"
                title="Swap languages"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>

              {/* Target Lang */}
              <div className="flex-1 sm:flex-initial">
                <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                  Translate Incoming To
                </label>
                <select
                  value={targetLang.code}
                  onChange={(e) => {
                    const found = AFRICAN_LANGUAGES.find((l) => l.code === e.target.value);
                    if (found) setTargetLang(found);
                  }}
                  className="w-full rounded-xl bg-zinc-950 border border-white/15 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  {AFRICAN_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.flag} {l.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Translation Interactive Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* Left Box: Original Input */}
            <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-5 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <span>{sourceLang.flag}</span>
                    <span>{sourceLang.name}</span>
                    <span className="text-zinc-500 font-normal">({sourceLang.region})</span>
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono">Original Audio / Text</span>
                </div>

                <div className="rounded-xl bg-zinc-900/80 p-4 border border-white/5">
                  <p className="text-base sm:text-lg font-medium text-white leading-relaxed">
                    &quot;{currentPhrase.original}&quot;
                  </p>
                  <p className="text-xs text-amber-400/80 italic mt-2">
                    Pronunciation: {currentPhrase.pronunciation}
                  </p>
                </div>
              </div>

              {/* Sample Phrases Picker */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-semibold text-zinc-400">
                  Try other phrases in {sourceLang.name}:
                </span>
                <div className="flex flex-wrap gap-2">
                  {sourceLang.samplePhrases.map((phrase, i) => (
                    <button
                      key={i}
                      onClick={() => setActivePhraseIndex(i)}
                      className={`rounded-lg px-2.5 py-1 text-xs transition-all ${
                        activePhraseIndex === i
                          ? 'bg-amber-500 text-black font-bold'
                          : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800'
                      }`}
                    >
                      Phrase #{i + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Box: Realtime Translated Output */}
            <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/20 via-zinc-950 to-zinc-950 p-5 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <span>{targetLang.flag}</span>
                    <span>{targetLang.name}</span>
                    <span className="text-zinc-500 font-normal">({targetLang.region})</span>
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                    <Sparkles className="h-2.5 w-2.5" />
                    AI Translated
                  </span>
                </div>

                <div className="rounded-xl bg-zinc-900/80 p-4 border border-amber-500/20">
                  <p className="text-base sm:text-lg font-medium text-emerald-300 leading-relaxed">
                    &quot;{currentPhrase.english}&quot;
                  </p>
                  <p className="text-xs text-zinc-400 mt-2">
                    Real-time cross-language neural translation (latency: ~280ms)
                  </p>
                </div>
              </div>

              {/* Speech Voice Output Simulation */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={handleSimulateVoice}
                  disabled={isPlayingAudio}
                  className="flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 px-4 py-2 text-xs font-bold text-white transition-all shadow-md shadow-emerald-600/20"
                >
                  <Volume2 className={`h-4 w-4 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                  {isPlayingAudio ? 'Playing Translated Voice...' : `Listen in ${targetLang.name}`}
                </button>

                {/* Animated Waveform indicator */}
                <div className="flex items-center gap-1">
                  {[12, 24, 18, 28, 14, 22, 10].map((height, i) => (
                    <span
                      key={i}
                      style={{
                        height: isPlayingAudio ? `${height}px` : '6px',
                        transition: 'height 0.2s ease',
                      }}
                      className="w-1 rounded-full bg-emerald-400"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
