'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  contactInviteService,
  DiscoverableContact,
} from '@/lib/contactInviteService';
import {
  X,
  Search,
  UserPlus,
  Check,
  Globe,
  MapPin,
  Sparkles,
  ShieldCheck,
  Send,
  MessageSquare,
  Loader2,
} from 'lucide-react';

interface FindContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExistingChat?: (contactId: string) => void;
}

export default function FindContactsModal({
  isOpen,
  onClose,
  onSelectExistingChat,
}: FindContactsModalProps) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [inviteGreetingMap, setInviteGreetingMap] = useState<Record<string, string>>({});
  const [sentInvitesMap, setSentInvitesMap] = useState<Record<string, boolean>>({});
  const [activeInviteContact, setActiveInviteContact] = useState<DiscoverableContact | null>(null);
  const [contacts, setContacts] = useState<DiscoverableContact[]>([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsLoadingContacts(true);

    const timer = setTimeout(async () => {
      try {
        const results = await contactInviteService.searchContacts(
          searchQuery,
          user?.id,
          user?.email
        );
        if (isMounted) {
          setContacts(results);
          setIsLoadingContacts(false);
        }
      } catch (err) {
        if (isMounted) {
          setIsLoadingContacts(false);
        }
      }
    }, 200);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [isOpen, searchQuery, user?.id, user?.email]);

  if (!isOpen) return null;

  const filteredContacts = contacts.filter((c) => {
    if (selectedCountry === 'all') return true;
    return c.country.toLowerCase() === selectedCountry.toLowerCase();
  });

  const handleSendInvite = (contact: DiscoverableContact) => {
    if (!user) return;

    const userFlag =
      user.countryCode === 'ZA'
        ? '🇿🇦'
        : user.countryCode === 'NG'
        ? '🇳🇬'
        : user.countryCode === 'KE'
        ? '🇰🇪'
        : user.countryCode === 'GH'
        ? '🇬🇭'
        : user.countryCode === 'SN'
        ? '🇸🇳'
        : '🌍';

    const greeting =
      inviteGreetingMap[contact.id] ||
      `Sawubona ${contact.name}! I just joined Yethu and would love to connect and chat in ${user.nativeLanguage || 'isiZulu'}.`;

    contactInviteService.sendInvite({
      senderId: user.id,
      senderName: user.name,
      senderHandle: user.handle,
      senderAvatar:
        user.avatarUrl ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      senderCountryFlag: userFlag,
      senderCountry: user.country || 'South Africa',
      senderLanguage: user.nativeLanguage || 'isiZulu',
      recipientId: contact.id,
      recipientHandle: contact.handle,
      greeting,
    });

    setSentInvitesMap((prev) => ({ ...prev, [contact.id]: true }));
    setActiveInviteContact(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-2xl rounded-3xl border border-amber-500/30 bg-[#0d0f12] p-6 sm:p-8 shadow-2xl text-white flex flex-col max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rounded-full p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-5 shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl african-sunset-gradient shadow-lg shadow-orange-500/20 text-white">
            <UserPlus className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black tracking-tight text-white font-mono">
                DISCOVER CONTACTS
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                PAN-AFRICAN
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Find creators, innovators, and friends across Africa and invite them to chat.
            </p>
          </div>
        </div>

        {/* Search & Country Filters */}
        <div className="space-y-3 mb-4 shrink-0">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, @handle, city, language, or bio..."
              className="w-full rounded-2xl bg-zinc-900 border border-white/10 pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
            {[
              { id: 'all', label: 'All Africa 🌍' },
              { id: 'South Africa', label: '🇿🇦 South Africa' },
              { id: 'Nigeria', label: '🇳🇬 Nigeria' },
              { id: 'Kenya', label: '🇰🇪 Kenya' },
              { id: 'Ghana', label: '🇬🇭 Ghana' },
              { id: 'Senegal', label: '🇸🇳 Senegal' },
              { id: 'Rwanda', label: '🇷🇼 Rwanda' },
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCountry(c.id)}
                className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-all shrink-0 ${
                  selectedCountry === c.id
                    ? 'bg-amber-500 text-black font-bold shadow-sm shadow-orange-500/20'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-white/5'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contacts Directory List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {isLoadingContacts ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-zinc-400 text-xs">
              <Loader2 className="h-6 w-6 animate-spin text-amber-400" />
              <span>Searching real authenticated Yethu accounts...</span>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="text-center py-14 px-4 text-xs space-y-2">
              <div className="flex justify-center mb-2">
                <div className="h-10 w-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-500">
                  <Search className="h-4 w-4" />
                </div>
              </div>
              <p className="font-semibold text-zinc-300">
                {searchQuery
                  ? `No real user found matching "${searchQuery}"`
                  : 'No other real accounts found yet'}
              </p>
              <p className="text-zinc-500 max-w-sm mx-auto">
                Search for real users by their full name (e.g. Warren, Neil), username handle, or email address.
              </p>
            </div>
          ) : (
            filteredContacts.map((contact) => {
              const isSent = Boolean(sentInvitesMap[contact.id]);
              const isCustomizing = activeInviteContact?.id === contact.id;

              return (
                <div
                  key={contact.id}
                  className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4 transition-all hover:border-amber-500/40 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                      <div className="relative shrink-0">
                        <img
                          src={contact.avatar}
                          alt={contact.name}
                          className="h-12 w-12 rounded-2xl object-cover border border-white/10"
                        />
                        <span className="absolute -bottom-1 -right-1 text-sm">
                          {contact.countryFlag}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-white">{contact.name}</h3>
                          <span className="text-[11px] text-zinc-400 font-mono">
                            {contact.handle}
                          </span>
                          {contact.isCreator && (
                            <span className="rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 px-1.5 py-0.5 text-[9px] font-bold">
                              CREATOR
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-zinc-300 mt-1 line-clamp-2">
                          {contact.bio}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-400 mt-1.5">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-zinc-500" />
                            {contact.country}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-emerald-400 font-medium">
                            <Globe className="h-3 w-3" />
                            {contact.language}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2 sm:self-center">
                      {isSent ? (
                        <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-2 text-xs font-bold text-emerald-400">
                          <Check className="h-4 w-4" />
                          <span>Invite Sent</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            if (isCustomizing) {
                              setActiveInviteContact(null);
                            } else {
                              setActiveInviteContact(contact);
                            }
                          }}
                          className="flex items-center gap-1.5 rounded-xl african-sunset-gradient px-4 py-2 text-xs font-bold text-white shadow-md shadow-orange-500/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                        >
                          <UserPlus className="h-4 w-4" />
                          <span>Invite to Chat</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Optional Custom Greeting Expandable Box */}
                  {isCustomizing && !isSent && (
                    <div className="pt-2 border-t border-white/5 space-y-2 animate-fade-in">
                      <label className="block text-[11px] font-semibold text-zinc-300">
                        Add a personal greeting or voice tone:
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={
                            inviteGreetingMap[contact.id] ??
                            `Sawubona ${contact.name}! I would love to connect and chat on Yethu.`
                          }
                          onChange={(e) =>
                            setInviteGreetingMap((prev) => ({
                              ...prev,
                              [contact.id]: e.target.value,
                            }))
                          }
                          className="flex-1 rounded-xl bg-zinc-950 border border-white/15 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                        />
                        <button
                          onClick={() => handleSendInvite(contact)}
                          className="flex items-center gap-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 text-xs font-bold shadow transition-all"
                        >
                          <Send className="h-3.5 w-3.5" />
                          <span>Send</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer Note */}
        <div className="pt-4 mt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Encrypted 1-on-1 chats unlock once invite is approved.</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-zinc-800 hover:bg-zinc-700 px-4 py-1.5 text-xs font-bold text-white transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
