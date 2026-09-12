'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, UserProfile } from '@/lib/insforge';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalTab: 'signin' | 'signup';
  isProfileModalOpen: boolean;
  isGoLiveModalOpen: boolean;
  isWatchModalOpen: boolean;
  activeWatchRoom: {
    roomName: string;
    title: string;
    creatorName: string;
    countryFlag: string;
    viewersCount: number;
  } | null;
  openAuthModal: (tab?: 'signin' | 'signup') => void;
  closeAuthModal: () => void;
  openProfileModal: () => void;
  closeProfileModal: () => void;
  openGoLiveModal: () => void;
  closeGoLiveModal: () => void;
  openWatchModal: (room: {
    roomName: string;
    title: string;
    creatorName: string;
    countryFlag: string;
    viewersCount?: number;
  }) => void;
  closeWatchModal: () => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (params: {
    email: string;
    password: string;
    name: string;
    handle: string;
    nativeLanguage: string;
    targetLanguage: string;
    country?: string;
    countryCode?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loginDemo: (type: 'nandi' | 'kofi') => void;
  updateUserLanguages: (nativeLang: string, targetLang: string) => void;
  updateFullProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
}

const DEMO_PROFILES: Record<'nandi' | 'kofi', UserProfile> = {
  nandi: {
    id: 'demo_nandi_01',
    email: 'nandi.m@yethu.africa',
    name: 'Nandi Mthembu',
    handle: '@nandi_m',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    country: 'South Africa',
    countryCode: 'ZA',
    bio: 'Soweto vibes & Amapiano culture. Live in 120s! 🇿🇦✨',
    nativeLanguage: 'isiZulu',
    targetLanguage: 'Kiswahili',
    isCreator: true,
    createdAt: new Date().toISOString(),
  },
  kofi: {
    id: 'demo_kofi_02',
    email: 'kofi.mensah@yethu.africa',
    name: 'Kofi Mensah',
    handle: '@kofi_accra',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    country: 'Ghana',
    countryCode: 'GH',
    bio: 'Accra tech founder & highlife music enthusiast. 🇬🇭🔥',
    nativeLanguage: 'English (Pan-African)',
    targetLanguage: 'isiXhosa',
    isCreator: true,
    createdAt: new Date().toISOString(),
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'signup'>('signup');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isGoLiveModalOpen, setIsGoLiveModalOpen] = useState<boolean>(false);
  const [isWatchModalOpen, setIsWatchModalOpen] = useState<boolean>(false);
  const [activeWatchRoom, setActiveWatchRoom] = useState<{
    roomName: string;
    title: string;
    creatorName: string;
    countryFlag: string;
    viewersCount: number;
  } | null>(null);

  useEffect(() => {
    // Load local user on mount
    const current = authService.getCurrentLocalUser();
    if (current) {
      setUser(current);
    }
    setIsLoading(false);
  }, []);

  const openAuthModal = (tab: 'signin' | 'signup' = 'signup') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const openProfileModal = () => setIsProfileModalOpen(true);
  const closeProfileModal = () => setIsProfileModalOpen(false);

  const openGoLiveModal = () => setIsGoLiveModalOpen(true);
  const closeGoLiveModal = () => setIsGoLiveModalOpen(false);

  const openWatchModal = (room: {
    roomName: string;
    title: string;
    creatorName: string;
    countryFlag: string;
    viewersCount?: number;
  }) => {
    setActiveWatchRoom({
      roomName: room.roomName,
      title: room.title,
      creatorName: room.creatorName,
      countryFlag: room.countryFlag,
      viewersCount: room.viewersCount || 1420,
    });
    setIsWatchModalOpen(true);
  };

  const closeWatchModal = () => {
    setIsWatchModalOpen(false);
    setActiveWatchRoom(null);
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const result = await authService.signIn({ email, password });
    setIsLoading(false);
    if (result.error) {
      return { success: false, error: result.error };
    }
    if (result.user) {
      setUser(result.user);
      setIsAuthModalOpen(false);
      return { success: true };
    }
    return { success: false, error: 'Unknown authentication error' };
  };

  const signup = async (params: {
    email: string;
    password: string;
    name: string;
    handle: string;
    nativeLanguage: string;
    targetLanguage: string;
    country?: string;
    countryCode?: string;
  }) => {
    setIsLoading(true);
    const result = await authService.signUp(params);
    setIsLoading(false);
    if (result.error) {
      return { success: false, error: result.error };
    }
    if (result.user) {
      setUser(result.user);
      setIsAuthModalOpen(false);
      return { success: true };
    }
    return { success: false, error: 'Sign up failed' };
  };

  const logout = async () => {
    setIsLoading(true);
    await authService.signOut();
    setUser(null);
    setIsProfileModalOpen(false);
    setIsGoLiveModalOpen(false);
    setIsLoading(false);
  };

  const loginDemo = (type: 'nandi' | 'kofi') => {
    const profile = DEMO_PROFILES[type];
    authService.setLocalUser(profile);
    setUser(profile);
    setIsAuthModalOpen(false);
  };

  const updateUserLanguages = (nativeLang: string, targetLang: string) => {
    if (!user) return;
    const updated = {
      ...user,
      nativeLanguage: nativeLang,
      targetLanguage: targetLang,
    };
    setUser(updated);
    authService.setLocalUser(updated);
  };

  const updateFullProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { success: false, error: 'Not signed in' };
    const merged = { ...user, ...updates };
    setUser(merged);
    const res = await authService.saveProfile(user.id, updates);
    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthModalOpen,
        authModalTab,
        isProfileModalOpen,
        isGoLiveModalOpen,
        isWatchModalOpen,
        activeWatchRoom,
        openAuthModal,
        closeAuthModal,
        openProfileModal,
        closeProfileModal,
        openGoLiveModal,
        closeGoLiveModal,
        openWatchModal,
        closeWatchModal,
        login,
        signup,
        logout,
        loginDemo,
        updateUserLanguages,
        updateFullProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
