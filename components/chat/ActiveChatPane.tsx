'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Conversation, ChatMessage } from '@/lib/chatData';
import { useAuth } from '@/context/AuthContext';
import { getConversationSecurityFingerprint } from '@/lib/crypto';
import { realtimeChat } from '@/lib/realtimeChatService';
import {
  Send,
  Mic,
  Paperclip,
  Smile,
  Radio,
  Phone,
  Video,
  Search,
  MoreVertical,
  Volume2,
  Clock,
  Sparkles,
  CheckCheck,
  Languages,
  ShieldCheck,
  Lock,
  KeyRound,
  X,
  LogOut,
  ArrowLeft,
} from 'lucide-react';

interface ActiveChatPaneProps {
  conversation: Conversation;
  onSendMessage: (conversationId: string, text: string) => void;
  isPeerTyping?: boolean;
  onBack?: () => void;
}

export default function ActiveChatPane({
  conversation,
  onSendMessage,
  isPeerTyping = false,
  onBack,
}: ActiveChatPaneProps) {
  const { user, openGoLiveModal, openWatchModal, logout } = useAuth();
  const [inputText, setInputText] = useState('');
  const [showOriginals, setShowOriginals] = useState(false);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [securityFingerprint, setSecurityFingerprint] = useState<string>('••••••');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation.messages, isPeerTyping]);

  useEffect(() => {
    if (conversation.isEncrypted) {
      getConversationSecurityFingerprint(conversation.id).then(setSecurityFingerprint);
    }
  }, [conversation.id, conversation.isEncrypted]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputText(val);
    if (user && val.trim()) {
      realtimeChat.broadcastTyping(conversation.id, user.id, user.name);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    // Clear the typing indicator immediately when sending
    if (user) realtimeChat.clearTyping(conversation.id, user.id, user.name);
    onSendMessage(conversation.id, inputText.trim());
    setInputText('');
  };

  const togglePlayVoice = (id: string) => {
    if (playingVoiceId === id) {
      setPlayingVoiceId(null);
    } else {
      setPlayingVoiceId(id);
      setTimeout(() => setPlayingVoiceId(null), 3000);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#08090b] relative overflow-hidden">
      {/* Background Subtle African Motif Overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ea580c_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* 1. Chat Header */}
      <div className="h-16 px-4 border-b border-white/10 bg-[#0c0e12]/90 backdrop-blur-md flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          {/* Mobile-only back button */}
          {onBack && (
            <button
              onClick={onBack}
              className="md:hidden flex items-center justify-center h-8 w-8 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors shrink-0"
              aria-label="Back to conversations"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <div className="relative">
            <img
              src={conversation.avatar}
              alt={conversation.title}
              className="h-10 w-10 rounded-full object-cover border border-white/10"
            />
            <span className="absolute bottom-0 right-0 text-xs">{conversation.countryFlag}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>{conversation.title}</span>
                {conversation.isLiveNow && (
                  <span className="flex items-center gap-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2 py-0.5 text-[9px] font-bold animate-pulse">
                    <Radio className="h-2.5 w-2.5" />
                    120s Live
                  </span>
                )}
              </h2>

              {conversation.isEncrypted && (
                <button
                  onClick={() => setShowSecurityModal(true)}
                  title="Verified End-to-End Encrypted (AES-256)"
                  className="flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 hover:bg-emerald-500/25 transition-colors cursor-pointer"
                >
                  <Lock className="h-3 w-3" />
                  <span>E2EE</span>
                </button>
              )}
            </div>

            <p className="text-[11px] text-zinc-400 flex items-center gap-1">
              {isPeerTyping ? (
                <span className="text-amber-400 font-semibold flex items-center gap-1 animate-pulse">
                  <span>typing</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
                </span>
              ) : (
                <>
                  <span>{conversation.membersCount ? `${conversation.membersCount} participants` : 'Online'}</span>
                  <span>•</span>
                  <span className="text-emerald-400">{conversation.primaryLanguage}</span>
                  {conversation.isEncrypted && (
                    <>
                      <span>•</span>
                      <span className="text-zinc-500">AES-256</span>
                    </>
                  )}
                </>
              )}
            </p>
          </div>
        </div>

        {/* Action icons & Translation toggle */}
        <div className="flex items-center gap-2">
          {/* Join Live Broadcast Banner Button if room is live */}
          {conversation.isLiveNow && (
            <button
              onClick={() =>
                openWatchModal({
                  roomName: conversation.id,
                  title: conversation.title,
                  creatorName: conversation.countryName,
                  countryFlag: conversation.countryFlag,
                  viewersCount: conversation.liveViewersCount,
                })
              }
              className="hidden sm:flex items-center gap-1.5 rounded-full african-sunset-gradient px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-orange-500/20 hover:brightness-110 active:scale-95 transition-all"
            >
              <Radio className="h-3.5 w-3.5 animate-pulse" />
              <span>Watch Live ({conversation.liveViewersCount || 1420})</span>
            </button>
          )}

          <button
            onClick={() => setShowOriginals(!showOriginals)}
            title="Toggle Original vs Translated messages"
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border transition-all ${
              showOriginals
                ? 'bg-zinc-800 text-zinc-300 border-zinc-700'
                : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
            }`}
          >
            <Languages className="h-3.5 w-3.5" />
            <span className="hidden md:inline">{showOriginals ? 'Showing Original' : 'Auto-Translated'}</span>
          </button>

          {conversation.isEncrypted && (
            <button
              onClick={() => setShowSecurityModal(true)}
              className="p-2 rounded-full text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40 transition-colors"
              title="View E2EE Cryptographic Fingerprint"
            >
              <ShieldCheck className="h-4 w-4" />
            </button>
          )}

          <button className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
            <Video className="h-4 w-4" />
          </button>
          <button className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
            <Phone className="h-4 w-4" />
          </button>

          <button
            onClick={logout}
            title="Sign Out of Yethu"
            className="flex items-center gap-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/25 text-rose-400 hover:text-rose-300 px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Sign Out</span>
          </button>
        </div>
      </div>

      {/* 2. Real-Time Translation & Encryption Status Ribbon */}
      <div className="px-4 py-1.5 bg-gradient-to-r from-amber-950/30 via-zinc-900 to-zinc-950 border-b border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
        <div className="flex items-center gap-2">
          {conversation.isEncrypted ? (
            <>
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>
                <strong className="text-emerald-400">End-to-End Encrypted</strong>: Messages and calls are secured with client-side AES-256.
              </span>
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span>
                Realtime AI Translation active: <strong className="text-zinc-200">{conversation.primaryLanguage}</strong> ➔ <strong className="text-amber-400">{user?.targetLanguage || 'English'}</strong>
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
          <Clock className="h-3 w-3 text-amber-500/70" />
          <span>Expires in 48h</span>
        </div>
      </div>

      {/* 3. Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 z-0">
        {conversation.messages.map((msg) => {
          const isMyMsg = msg.isMe || msg.senderId === user?.id;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMyMsg ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-lg rounded-2xl p-3.5 shadow-md relative group ${
                  isMyMsg
                    ? 'bg-gradient-to-br from-amber-600 to-orange-600 text-white rounded-tr-xs'
                    : 'bg-zinc-900/90 border border-white/10 text-zinc-200 rounded-tl-xs'
                }`}
              >
                {/* Sender Name & Flag for group incoming */}
                {!isMyMsg && (
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                      <span>{msg.countryFlag}</span>
                      <span>{msg.senderName}</span>
                    </span>
                    <span className="text-[9px] text-zinc-500 font-mono">
                      {msg.sourceLanguage}
                    </span>
                  </div>
                )}

                {/* Voice Note Player if present */}
                {msg.voiceNote && (
                  <div className="mb-2.5 rounded-xl bg-black/40 p-2.5 flex items-center gap-3 border border-white/5">
                    <button
                      onClick={() => togglePlayVoice(msg.id)}
                      className="h-8 w-8 rounded-full bg-amber-500 text-black flex items-center justify-center shrink-0 shadow active:scale-95 transition-transform"
                    >
                      <Volume2 className={`h-4 w-4 ${playingVoiceId === msg.id ? 'animate-bounce' : ''}`} />
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-1 h-6">
                        {msg.voiceNote.waveform.map((bar, idx) => (
                          <span
                            key={idx}
                            style={{ height: `${bar}%` }}
                            className={`w-1 rounded-full transition-all ${
                              playingVoiceId === msg.id ? 'bg-amber-400' : 'bg-zinc-600'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-[10px] text-zinc-400 italic mt-1">
                        Transcription: &quot;{msg.voiceNote.transcription}&quot;
                      </p>
                    </div>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      {msg.voiceNote.duration}
                    </span>
                  </div>
                )}

                {/* Dual-Text Display: Original & AI Translated */}
                <div className="space-y-1">
                  {showOriginals ? (
                    <p className="text-sm font-medium leading-relaxed">
                      {msg.originalText}
                    </p>
                  ) : (
                    <>
                      <p className="text-sm font-medium leading-relaxed">
                        {msg.translatedText || msg.originalText}
                      </p>
                      {msg.translatedText && msg.translatedText !== msg.originalText && (
                        <p className={`text-[11px] italic opacity-80 border-t pt-1 mt-1 ${isMyMsg ? 'border-white/20' : 'border-white/10'}`}>
                          Original ({msg.sourceLanguage}): &quot;{msg.originalText}&quot;
                        </p>
                      )}
                    </>
                  )}
                </div>

                {/* Message Timestamp, E2EE status & 48-Hour TTL */}
                <div className={`flex items-center justify-between gap-4 mt-2 text-[10px] ${isMyMsg ? 'text-white/80' : 'text-zinc-500'}`}>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="h-2.5 w-2.5" />
                      {msg.expiresIn}
                    </span>
                    {(msg.isEncrypted || conversation.isEncrypted) && (
                      <span
                        title="Client-side Encrypted Message (AES-256)"
                        className="flex items-center gap-0.5 text-emerald-400 text-[9px] font-mono"
                      >
                        <Lock className="h-2.5 w-2.5" />
                        <span>E2EE</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <span>{msg.timestamp}</span>
                    {isMyMsg && <CheckCheck className="h-3 w-3 text-white" />}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* 4. Chat Input Bar */}
      <div className="p-3 bg-[#0c0e12] border-t border-white/10 z-10 space-y-1.5">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <button
            type="button"
            className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors"
          >
            <Smile className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors"
          >
            <Paperclip className="h-5 w-5" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            placeholder={`Type in ${user?.nativeLanguage || 'your language'} (auto-translates for everyone)...`}
            className="flex-1 rounded-xl bg-zinc-900 border border-white/10 px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors"
          />

          <button
            type="button"
            className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors"
            title="Send Voice Note"
          >
            <Mic className="h-5 w-5" />
          </button>

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="flex h-10 w-10 items-center justify-center rounded-xl african-sunset-gradient text-white shadow-md shadow-orange-500/25 hover:brightness-110 active:scale-95 disabled:opacity-40 transition-all shrink-0"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>

        {/* Input Language Matrix Status */}
        <div className="flex items-center justify-between px-2 text-[10px] text-zinc-500">
          <span>
            You are speaking: <strong className="text-zinc-300">{user?.nativeLanguage || 'isiZulu'}</strong>
          </span>
          <span className="text-amber-400/80">
            {conversation.isEncrypted
              ? '🔒 Secured with End-to-End Encryption (AES-GCM-256)'
              : 'Yethu AI translates for each recipient instantly'}
          </span>
        </div>
      </div>

      {/* 5. Cryptographic Security Fingerprint Modal */}
      {showSecurityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl border border-emerald-500/30 bg-[#0d0f12] p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowSecurityModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">End-to-End Encrypted</h3>
                <p className="text-[11px] text-zinc-400">Verified Private 1-on-1 Channel</p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Messages and live calls in this conversation are encrypted with <strong>AES-GCM-256</strong> via the browser Web Crypto API. Only you and <strong>{conversation.title}</strong> can read what is sent. Neither Yethu servers nor third parties have access to your private encryption keys.
            </p>

            {/* Cryptographic 6-Digit Fingerprint */}
            <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4 text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                <KeyRound className="h-3 w-3 text-amber-400" />
                <span>Security Fingerprint</span>
              </div>
              <div className="text-2xl font-black font-mono tracking-widest text-emerald-400 pt-1">
                {securityFingerprint.slice(0, 3)} {securityFingerprint.slice(3)}
              </div>
              <p className="text-[10px] text-zinc-500">
                Compare this security code with {conversation.title} to verify end-to-end encryption.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowSecurityModal(false)}
                className="w-full rounded-xl bg-zinc-800 hover:bg-zinc-700 py-2.5 text-xs font-bold text-white transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
