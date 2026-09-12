'use client';

import React from 'react';
import { ChatInvite } from '@/lib/contactInviteService';
import { Check, X, Bell, Lock, MessageSquare, Sparkles } from 'lucide-react';

interface InviteNotificationBannerProps {
  invite: ChatInvite;
  onAccept: (invite: ChatInvite) => void;
  onReject: (invite: ChatInvite) => void;
}

export default function InviteNotificationBanner({
  invite,
  onAccept,
  onReject,
}: InviteNotificationBannerProps) {
  return (
    <div className="mx-4 sm:mx-8 mt-3 mb-1 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-zinc-900 to-orange-950/40 p-4 shadow-xl backdrop-blur-md animate-fade-in text-white select-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Sender Info & Greeting */}
        <div className="flex items-start gap-3.5">
          <div className="relative shrink-0">
            <img
              src={invite.senderAvatar}
              alt={invite.senderName}
              className="h-11 w-11 rounded-2xl object-cover border border-amber-500/30"
            />
            <span className="absolute -bottom-1 -right-1 text-xs">
              {invite.senderCountryFlag}
            </span>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[10px] font-bold text-amber-400 font-mono">
                <Bell className="h-2.5 w-2.5" />
                CHAT INVITE
              </span>
              <h4 className="text-xs font-bold text-white">
                {invite.senderName} <span className="text-zinc-400 font-normal font-mono">{invite.senderHandle}</span>
              </h4>
              <span className="text-[10px] text-zinc-500 font-mono">
                from {invite.senderCountry}
              </span>
            </div>

            <p className="text-xs text-zinc-200 italic">
              &quot;{invite.greeting || 'Sawubona! Would love to connect and chat on Yethu.'}&quot;
            </p>

            <div className="flex items-center gap-2 text-[10px] text-emerald-400">
              <Lock className="h-3 w-3" />
              <span>Accepting creates a private, AES-256 end-to-end encrypted chat channel</span>
            </div>
          </div>
        </div>

        {/* Action Buttons: Approve / Reject */}
        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
          <button
            onClick={() => onReject(invite)}
            className="flex items-center gap-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-white/10 px-3 py-2 text-xs font-bold text-zinc-300 hover:text-white transition-all active:scale-95"
          >
            <X className="h-3.5 w-3.5" />
            <span>Decline</span>
          </button>

          <button
            onClick={() => onAccept(invite)}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 transition-all active:scale-95 cursor-pointer"
          >
            <Check className="h-3.5 w-3.5" />
            <span>Approve & Chat</span>
          </button>
        </div>
      </div>
    </div>
  );
}
